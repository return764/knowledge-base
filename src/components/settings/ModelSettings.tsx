import {useEffect, useMemo, useState} from "react";
import Button from "../basic/button/button.tsx";
import Table, {Column} from "../basic/table/table.tsx";
import {queryAllModels, saveAndUpdateModels} from "../../service/model.ts";
import toast from "react-hot-toast";
import {useQuery} from "../../hooks/useQuery.ts";
import Switch from "../basic/form/components/switch.tsx";
import {API} from "../../api";
import ModelSettingSidebar from "./ModelSettingSidebar.tsx";
import {AiFillOpenAI} from "react-icons/ai";
import SiliconFlowSvg from "../../assets/siliconflow.svg?react";
import OllamaSvg from "../../assets/ollama.svg?react";
import QwenSvg from "../../assets/qwen.svg?react";
import Form, {useForm} from "../basic/form/form.tsx";
import FormItem from "../basic/form/form_item.tsx";
import Input from "../basic/form/components/Input.tsx";
import {LLMProvider} from "../../api/model_provider.ts";

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

const menuItems = [
    {
        key: 'OpenAI',
        icon: AiFillOpenAI,
        label: 'OpenAI'
    },
    {
        key: 'SiliconFlow',
        icon: SiliconFlowSvg,
        label: 'SiliconFlow'
    },
    {
        key: 'Ollama',
        icon: OllamaSvg,
        label: 'Ollama'
    },
    {
        key: 'Qwen',
        icon: QwenSvg,
        label: 'Qwen'
    }
];

function ModelSettings() {
    const [isValidating, setIsValidating] = useState<boolean>(false)
    const [selectedType, setSelectedType] = useState('OpenAI');
    const {data: provider} = useQuery("modelProvider", "queryByName", selectedType)
    const {data: models, mutate} = useQuery("model", "queryAllByProviderName", provider?.name)
    const [form] = useForm()


    useEffect(() => {
        if (!provider) return
        form.setFieldValue('url', provider.url)
        form.setFieldValue('api_key', provider.api_key)
    }, [provider]);

    const handleValidate = async () => {
        setIsValidating(true)
        try {
            const apiURL = form.getFieldValue('url')
            const apiKey = form.getFieldValue('api_key')
            const models = await queryAllModels(apiURL, apiKey)
            await API.modelProvider.update<LLMProvider>({
                ...provider,
                api_key: apiKey,
                url: apiURL
            })
            await saveAndUpdateModels(models, provider.id)
            toast.success("保存model成功")
        } catch (e) {
            console.error(e)
            toast.error("保存model失败")
        } finally {
            setIsValidating(false)
            // await mutate()
        }
    }

    const handleActiveModel = async (index: number, checked: boolean) => {
        await API.model.activeModel(models[index].id, checked)
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
        <div className="h-full flex">
            <ModelSettingSidebar
                items={menuItems}
                onChange={setSelectedType}
                defaultSelected={selectedType}
            />
            <div className="flex-1 p-4 overflow-y-scroll">
                <section className="flex flex-col gap-6">
                    <Segment title={provider?.name}>
                        <div className="flex flex-col gap-4">
                            <Form form={form}>
                                <FormItem name="url" label="API URL">
                                    <Input placeholder="https://api.openai.com/v1"/>
                                </FormItem>
                                <FormItem name="api_key" label="API Key">
                                    <Input placeholder="sk-..."/>
                                </FormItem>
                            </Form>
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
                    <Table<ModelColumn>
                        className="mb-10"
                        columns={columns}
                        data={models}
                    />
                </section>
            </div>
        </div>
    );
}

export default ModelSettings;
