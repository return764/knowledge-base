import {CharacterTextSplitter} from "langchain/text_splitter";
import {v4 as uuidv4} from 'uuid';
import {API} from "../api";
import {ChatOpenAI, OpenAI, OpenAIEmbeddings} from "@langchain/openai";
import {SqliteFilter, SqliteVecStore} from "./vector_store.ts";
import {defaultDriver} from "../api/builder/database.ts";
import {ChatMessage, ChatStatus} from "../../components/chat/ChatContext.tsx";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate
} from "@langchain/core/prompts";
import {CHAT_PROMPT, CHAT_TITLE_PROMPT} from "./prompt.ts";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {ChatHistory} from "../api/chat_history.ts";
import {buildAiMessage, combineMessage} from "../../utils/chat.ts";


export const importText = async (text: string, kbId: string, datasetId: string) => {
    const splitter = new CharacterTextSplitter({
        chunkSize: 512,
        chunkOverlap: 100,
    });

    const texts = await splitter.splitText(text)
    const metadata = texts.map(() => ({
        "kb_id": kbId,
        "dataset_id": datasetId,
        "id": uuidv4(),
    }))
    const documents = await splitter.createDocuments(texts, metadata)

    const kb = await API.knowledgeBase.queryById(kbId);
    const model = await API.model.queryByIdWithProvider(kb!!.embedding_model_id)
    const embedding = new OpenAIEmbeddings({
        model: model?.name,
        configuration: {
            apiKey: model?.api_key,
            baseURL: model?.url,
        }
    })

    const store = new SqliteVecStore(embedding, {
        pool: defaultDriver
    })

    await store.addDocuments(documents)
    await API.dataset.updateDatasetCount(datasetId, documents.length)
}

export const sendChatMessage = async (updateChatMessage: (message: ChatMessage, status: ChatStatus) => void, chatId: string, message: ChatMessage) => {
    const chatSettings = await API.chat.getSettings(chatId)
    const chatModel = await API.model.queryByIdWithProvider(chatSettings.chat_model!!)
    if (!chatModel) {
        throw Error("There must be at least one llm model")
    }

    const openAI = new ChatOpenAI({
        model: chatModel.name,
        configuration: {
            baseURL: chatModel.url,
            apiKey: chatModel.api_key
        }
    })

    const histories = await API.chatHistory.queryByChatId(chatId);

    const prompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(CHAT_PROMPT),
        HumanMessagePromptTemplate.fromTemplate("{input}")
    ])

    let retriever = null
    if (chatSettings.knowledge_base && chatSettings.knowledge_base.length > 0) {
        const kb = await API.knowledgeBase.queryById(chatSettings.knowledge_base[0]);
        const model = await API.model.queryByIdWithProvider(kb!!.embedding_model_id)
        const embedding = new OpenAIEmbeddings({
            model: model?.name,
            configuration: {
                apiKey: model?.api_key,
                baseURL: model?.url,
            }
        })
        const store = new SqliteVecStore(embedding, {
            pool: defaultDriver
        })
        retriever = store.asRetriever({
            filter: SqliteFilter.In("kb_id", chatSettings.knowledge_base)
        });
    }


    const chain = RunnableSequence.from([
        {
            "documents": () => retriever ?? "NO DOCUMENTS",
            "chat_history": () => formatHistoryMessage(histories),
            "input": new RunnablePassthrough()
        },
        prompt,
        openAI
    ])

    const stream = await chain.stream(message.content)
    let assistantMsg = buildAiMessage("")
    try {
        for await (let chunk of stream) {
            combineMessage(assistantMsg, chunk.text)
            updateChatMessage(assistantMsg, "processing")
        }
    } catch (e) {
        console.error(e)
        updateChatMessage(assistantMsg, "failed")
    }
    updateChatMessage(assistantMsg, "ok")
}

export const generateChatTitle = async (chatId: string, messages: ChatMessage[]) => {
    const chatSettings = await API.chat.getSettings(chatId)
    const chatModel = await API.model.queryByIdWithProvider(chatSettings.chat_model!!)
    if (!chatModel) {
        throw Error("There must be at least one llm model")
    }

    const openAI = new OpenAI({
        model: chatModel.name,
        maxTokens: 50,
        configuration: {
            baseURL: chatModel.url,
            apiKey: chatModel.api_key
        }
    })

    const prompt = PromptTemplate.fromTemplate(CHAT_TITLE_PROMPT)
    const chain = prompt.pipe(openAI)

    return await chain.invoke({
        input: messages
    })
}

const formatHistoryMessage = (histories: ChatHistory[]): string => {
    return histories.map(it => `
        Role: ${it.role}
        Content: ${it.content}    
    `).join('\n')
}
