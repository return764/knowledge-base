import {useContext, useEffect, useMemo} from "react";
import { useQuery } from "../../hooks/useQuery";
import { KnowledgeBase } from "../../package/api/knowledge_base";
import Select from "../basic/form/components/select";
import Form from "../basic/form/form.tsx";
import FormItem from "../basic/form/form_item.tsx";
import {FormInstance} from "../basic/form/interface.ts";
import {LLMModel} from "../../package/api/model.ts";
import Combobox from "../basic/form/components/combobox.tsx";
import {ChatContext} from "./ChatContext.tsx";
import {ChatSettings as ChatSettingsModel} from "../../package/api/chat.ts";


function ChatSettings(props: {form: FormInstance}) {
    const {form} = props;
    const {data: knowledgeBases} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')
    const {data: activeModels} = useQuery<LLMModel[]>('model', 'queryAllActiveModel')
    const {settings} = useContext(ChatContext)

    const knowledgeBaseOptions = useMemo(() => {
        return (knowledgeBases ?? []).map((kb: KnowledgeBase) => ({
            label: kb.name,
            value: kb.id
        }))
    }, [knowledgeBases])

    const modelOptions = useMemo(() => {
        return (activeModels ?? []).filter(it => it.type === "llm").map((model: LLMModel) => ({
            label: model.name,
            value: model.id
        }))
    }, [activeModels])

    useEffect(() => {
        Object.keys(settings).forEach(it => {
            form.setFieldValue(it, settings[it as keyof ChatSettingsModel])
        })
    }, [settings]);

    return (
        <>
            <Form form={form}>
                <FormItem name={"knowledge_base"} label={"关联知识库"}>
                    <Combobox
                        options={knowledgeBaseOptions}
                    />
                </FormItem>
                <FormItem name={"chat_model"} label={"聊天模型"}>
                    <Select
                        options={modelOptions}
                    />
                </FormItem>
            </Form>
        </>
    );
}

export default ChatSettings;
