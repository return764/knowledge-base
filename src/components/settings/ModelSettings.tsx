import {useContext, useState} from "react";
import Button from "../basic/button/button.tsx";
import Table, {Column} from "../basic/table/table.tsx";
import Preference from "../preference/Preference.tsx";
import {LLM_TYPE, PreferenceEnum} from "../../utils/constant.ts";
import PreferenceContext from "../preference/context/PreferenceContext.ts";
import {queryAllModels, saveModels} from "../../service/model.ts";
import toast from "react-hot-toast";
import {useQuery} from "../../hooks/useQuery.ts";
import Switch from "../basic/form/components/switch.tsx";
import {API} from "../../api";

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
    const {data, mutate} = useQuery("model","queryAll", {}, {})
    const {onSave, getPrefValue} = useContext(PreferenceContext)

    const handleValidate = async () => {
        setIsValidating(true)
        try {
            const apiURL = getPrefValue(PreferenceEnum.OPENAI_API_URL)
            const apiKey = getPrefValue(PreferenceEnum.OPENAI_API_KEY)
            const models = await queryAllModels(apiURL, apiKey)
            await saveModels(models, LLM_TYPE.OPENAI, apiURL, apiKey)
            onSave([PreferenceEnum.OPENAI_API_URL, PreferenceEnum.OPENAI_API_KEY])
            toast.success("保存model成功")
        } finally {
            setIsValidating(false)
        }
    }

    const handleActiveModel = async (index: number, checked: boolean) => {
        await API.model.activeModel(data[index].id, checked)
        await mutate((data: any) => {
            data[index].active = checked ? 1 : 0
            return data
        })
    }

    const columns: Column<ModelColumn>[] = [
        {
            header: '模型名称',
            accessorKey: 'name',
        },
        {
            header: '启用',
            accessorKey: 'active',
            cell: ({renderValue, row}) => <Switch checked={renderValue() as number} onChange={(checked) => handleActiveModel(row.index, checked)}/>,
            meta: {
                width: '15%'
            }
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <Table<ModelColumn>
                columns={columns}
                data={data}
            />
            <Segment title="OpenAI API">
                <div className="flex flex-col gap-4">
                    <Preference
                        label="API Key"
                        placeholder='sk-....'
                        keyword={PreferenceEnum.OPENAI_API_KEY}/>
                    <Preference
                        label="API URL"
                        placeholder='https://api.openai.com/v1'
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
