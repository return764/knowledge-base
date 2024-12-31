import {useState} from "react";
import Button from "../basic/button/button.tsx";
import Table, {Column} from "../basic/table/table.tsx";
import Preference from "../preference/Preference.tsx";
import {PreferenceEnum} from "../../utils/constant.ts";

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
    const [isValidating, setIsValidating] = useState<boolean>(false)

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

    const columns: Column<ModelColumn>[] = [
        {
            header: '模型名称',
            accessorKey: 'name',
        },
        {
            header: '启用',
            accessorKey: 'active',
            meta: {
                width: '15%'
            }
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
                    <Preference
                        label="API Key"
                        keyword={PreferenceEnum.OPENAI_API_KEY}/>
                    <Preference
                        label="API URL"
                        keyword={PreferenceEnum.OPENAI_API_URL}/>
                    <div className="flex justify-end">
                        <Button
                            onClick={handleValidate}
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
