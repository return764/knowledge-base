import { useMemo } from "react";
import { useQuery } from "../../hooks/useQuery";
import { KnowledgeBase } from "../../model/knowledge_base";
import Select from "../basic/form/components/select";
import { ChatSettings as ChatSettingsModel } from "../../model/chat";

type ChatSettingsProps = {
    settings?: ChatSettingsModel,
    onChange: (settings: ChatSettingsModel) => void
}

function ChatSettings(props: ChatSettingsProps) {
    const {settings, onChange} = props;
    const {data} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')

    const options = useMemo(() => {
        return (data ?? []).map((kb: KnowledgeBase) => ({
            label: kb.name,
            value: kb.id
        }))
    }, [data])

    const handleKnowledgeBaseChange = (value: string) => {
        onChange({
            ...settings,
            knowledgeBase: [value],
        })
    }

    // 如何做相似度搜索 知识库id
    // 交给rust后，rust查出所有的数据集？直接将用户输入作为相似度搜索的参数，搜索出top_k的文档
    // 将文档填入上下文中交给llm进行解析
    // 正常返回数据

    return (
        <>
            <Select
                options={options}
                value={settings?.knowledgeBase?.[0]}
                onChange={handleKnowledgeBaseChange}
            />
        </>
    );
}

export default ChatSettings;
