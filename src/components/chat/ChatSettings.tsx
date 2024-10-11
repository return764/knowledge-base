import { useMemo, useState } from "react";
import { useQuery } from "../../hooks/useQuery";
import { KnowledgeBase } from "../../model/knowledge_base";
import Select from "../basic/form/components/select";

function ChatSettings(props) {
    const {data} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')
    const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<string>('')

    const options = useMemo(() => {
        return (data ?? []).map((kb: KnowledgeBase) => ({
            label: kb.name,
            value: kb.id
        }))
    }, [data])

    const handleKnowledgeBaseChange = (value: string) => {
        setSelectedKnowledgeBase(value)
    }

    return (
        <>
            <Select
                options={options}
                value={selectedKnowledgeBase}
                onChange={handleKnowledgeBaseChange}
            />
        </>
    );
}

export default ChatSettings;
