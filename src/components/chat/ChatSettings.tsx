import {useEffect, useMemo} from "react";
import { useQuery } from "../../hooks/useQuery";
import { KnowledgeBase } from "../../package/api/knowledge_base";
import Select from "../basic/form/components/select";
import Form from "../basic/form/form.tsx";
import FormItem from "../basic/form/form_item.tsx";
import {FormInstance} from "../basic/form/interface.ts";
import {LLMModel} from "../../package/api/model.ts";
import Combobox from "../basic/form/components/combobox.tsx";
import {ChatSettings as ChatSettingsModel} from "../../package/api/chat_settings.ts";
import {useAtom} from "jotai/index";
import {settingsAtom} from "../../store/chat.ts";


function ChatSettings(props: {form: FormInstance}) {
    const {form} = props;
    const {data: knowledgeBases} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')
    const {data: activeModels} = useQuery<LLMModel[]>('model', 'queryAllActiveModel')
    const [settings] = useAtom(settingsAtom)

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
                <FormItem name={"kb_ids"} label={"关联知识库"}>
                    <Combobox
                        options={knowledgeBaseOptions}
                    />
                </FormItem>
                <FormItem name={"chat_model_id"} label={"聊天模型"}>
                    <Select
                        options={modelOptions}
                    />
                </FormItem>
            </Form>
        </>
    );
}

export default ChatSettings;
