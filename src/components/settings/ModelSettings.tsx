import {useState} from "react";
import Input from "../basic/form/components/Input.tsx";
import Button from "../basic/button/button.tsx";
import Table from "../basic/table/table.tsx";
import {BiImport} from "react-icons/bi";

type SegmentProps = {
    title: string;
    children: React.ReactNode;
}

const Segment = ({title, children}: SegmentProps) => {
    return (
        <div className="rounded-lg border border-gray-200">
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            </div>
            <div className="p-4">
                {children}
            </div>
        </div>
    )
}

type ModelColumn = {
    name: string,
    active: boolean
}

function ModelSettings() {
    const [apiKey, setApiKey] = useState("")
    const [apiUrl, setApiUrl] = useState("")
    const [isValidating, setIsValidating] = useState(false)

    const handleValidate = async () => {
        setIsValidating(true)
        try {
            // TODO: 实现API验证逻辑
            await new Promise(resolve => setTimeout(resolve, 1000))
            // TODO: 处理验证结果
        } finally {
            setIsValidating(false)
        }
    }

    const columns = [
        {
            header: '模型名称',
            accessorKey: 'name'
        },
        {
            header: '启用',
            accessorKey: 'active'
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <Table<ModelColumn>
                columns={columns}
                data={[]}
            />
            <Segment title="OpenAI API">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-700">API Key</label>
                        <Input
                            type="block"
                            value={apiKey}
                            onChange={setApiKey}
                            placeholder="sk-..."
                        />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm text-gray-700">API URL</label>
                        <Input
                            type="block"
                            value={apiUrl}
                            onChange={setApiUrl}
                            placeholder="https://api.openai.com/v1"
                        />
                    </div>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleValidate}
                            icon={BiImport}
                            loading={isValidating}
                        >
                            验证
                        </Button>
                    </div>
                </div>
            </Segment>
        </div>
    );
}

export default ModelSettings;
