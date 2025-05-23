import {CharacterTextSplitter} from "langchain/text_splitter";
import {v4 as uuidv4} from 'uuid';
import {API} from "../api";
import {SqliteFilter, SqliteVecStore} from "./vector_store.ts";
import {defaultDriver} from "../api/builder/database.ts";
import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate
} from "@langchain/core/prompts";
import {CHAT_PROMPT, CHAT_TITLE_PROMPT} from "./prompt.ts";
import {RunnablePassthrough, RunnableSequence} from "@langchain/core/runnables";
import {ChatHistory} from "../api/chat_history.ts";
import {combineMessage, emptyAssistantMessage} from "../../utils/chat.ts";
import {store} from "../../components/WrapChatContext.tsx";
import {abortControllerActions, settingsAtom, updateChatMessageAtom} from "../../store/chat.ts";
import {ChatMessage} from "../api/chat.ts";
import {getEmbeddingModelFromKbBind, getModelFromChatBind} from "../../service/model.ts";
import {getProviderAPI} from "./platform";


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
    const model = await getEmbeddingModelFromKbBind(kbId)

    const provider = getProviderAPI(model)
    const embedding = provider.getEmbeddingModel()

    const store = new SqliteVecStore(embedding, {
        pool: defaultDriver
    })

    await store.addDocuments(documents)
    await API.dataset.updateDatasetCount(datasetId, documents.length)
}

export const sendChatMessage = async (chatId: string, message: ChatMessage) => {
    const model = await getModelFromChatBind(chatId)
    const provider = getProviderAPI(model)
    const chatSettings = store.get(settingsAtom)

    const histories = await API.chatHistory.queryByChatId(chatId);

    const prompt = ChatPromptTemplate.fromMessages([
        SystemMessagePromptTemplate.fromTemplate(CHAT_PROMPT),
        HumanMessagePromptTemplate.fromTemplate("{input}")
    ])

    let retriever = null
    if (chatSettings.kb_ids && chatSettings.kb_ids.length > 0) {
        const embedding = provider.getEmbeddingModel()
        const store = new SqliteVecStore(embedding, {
            pool: defaultDriver
        })
        retriever = store.asRetriever({
            filter: SqliteFilter.In("kb_id", chatSettings.kb_ids)
        });
    }

    const chain = RunnableSequence.from([
        {
            "documents": () => retriever ?? "NO DOCUMENTS",
            "chat_history": () => formatHistoryMessage(histories),
            "input": new RunnablePassthrough()
        },
        prompt,
        provider.getChatModel()
    ])

    const controller = new AbortController()
    let assistantMsg = emptyAssistantMessage()
    await store.set(updateChatMessageAtom, assistantMsg)
    const stream = await chain.stream(message.content, {
        signal: controller.signal
    })

    store.set(abortControllerActions.add, {key: chatId, controller: controller})
    try {
        for await (let chunk of stream) {
            combineMessage(assistantMsg, chunk.text)
            await store.set(updateChatMessageAtom, assistantMsg)
        }
        assistantMsg.status = 'ok'
    } catch (e) {
        assistantMsg.status = 'failed'
        if (e instanceof Error && e.message === 'Aborted') {
            assistantMsg.status = 'aborted'
        }
    } finally {
        await store.set(updateChatMessageAtom, assistantMsg)
        store.set(abortControllerActions.remove, chatId)
    }
}

export const generateChatTitle = async (chatId: string, messages: ChatMessage[]) => {
    const model = await getModelFromChatBind(chatId)
    const provider = getProviderAPI(model)

    const prompt = PromptTemplate.fromTemplate(CHAT_TITLE_PROMPT)
    const chain = prompt.pipe(provider.getModel())

    // TODO 这里使用一些模型的api时是有问题的例如, Qwen系列只有Coder的模型支持generation，普通模型只支持chat
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
