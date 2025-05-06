import {useEffect, useState} from "react";
import Button from "../basic/button/button.tsx";
import Table, {Column} from "../basic/table/table.tsx";
import {queryAllModels, saveModel} from "../../service/model.ts";
import toast from "react-hot-toast";
import {useQuery} from "../../hooks/useQuery.ts";
import Switch from "../basic/form/components/switch.tsx";
import {API} from "../../package/api";
import Form, {useForm} from "../basic/form/form.tsx";
import FormItem from "../basic/form/form_item.tsx";
import Input from "../basic/form/components/Input.tsx";
import {LLMProvider} from "../../package/api/model_provider.ts";
import {useBoolean} from "ahooks";
import Modal from "../basic/modal/modal.tsx";
import Select from "../basic/form/components/select.tsx";

import {LLMProviderConfig} from "../../package/assistant/platform/config.ts";

type SegmentProps = {
    title?: string;
    children: React.ReactNode;
}

const Segment = ({title, children}: SegmentProps) => {
    return (
        <div className="rounded-lg border border-gray-200">
            {
                title &&
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
                    <h3 className="text-sm font-medium text-gray-700">{title}</h3>
                  </div>
            }
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
    const [selectedType, setSelectedType] = useState('OpenAI');
    const {data: provider} = useQuery<LLMProvider>("modelProvider", "queryByName", selectedType)
    const {data: models, mutate} = useQuery("model", "queryAllWithProvider")
    const [form] = useForm()
    const [visibleAddModelModal, {toggle}] = useBoolean(false)

    useEffect(() => {
        if (!provider) return
        form.setFieldValue('url', provider.url)
        form.setFieldValue('api_key', provider.api_key)
    }, [provider]);

    const handleLoadModelOptions = async () => {
        try {
            const apiURL = form.getFieldValue('url')
            const apiKey = form.getFieldValue('api_key')
            const models = await queryAllModels(apiURL, apiKey)

            return models.map(it => ({
                label: it.id,
                value: it.id
            }))

        } catch (e) {
            console.error(e)
            return []
        }
    }

    const handleSaveModel = async () => {
        try {
            const apiURL = form.getFieldValue('url')
            const apiKey = form.getFieldValue('api_key')
            const model = form.getFieldValue('model')
            await API.modelProvider.update({
                ...provider!!,
                api_key: apiKey,
                url: apiURL
            })
            await saveModel(model, provider!!.id)
            toast.success("保存model成功")
        } catch (e) {
            console.error(e)
            toast.error("保存model失败")
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
            header: '供应商',
            accessorKey: 'provider'
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

    const toggleModelAddModal = () => {
        toggle()
    }

    return (
        <div className="h-full flex">
            <div className="flex-1 p-4 overflow-y-scroll">
                <section className="flex flex-col gap-2">
                    <div className="flex justify-end">
                        <Button onClick={toggleModelAddModal}>
                            添加模型
                        </Button>
                    </div>
                    <Table<ModelColumn>
                        className="mb-10"
                        columns={columns}
                        data={models}
                    />
                </section>
            </div>
            <Modal open={visibleAddModelModal}
                   onConfirm={handleSaveModel}
                   onClose={toggleModelAddModal}
                   title="添加模型"
                   size="middle"
            >
                <Select options={LLMProviderConfig.getProviderOptions()} onChange={setSelectedType} value={selectedType}></Select>
                <Segment>
                    <Form form={form}>
                        <FormItem name="url" label="API URL">
                            <Input placeholder="https://api.openai.com/v1"/>
                        </FormItem>
                        <FormItem name="api_key" label="API Key">
                            <Input type="password" placeholder="sk-..."/>
                        </FormItem>
                        <FormItem name="model" label="Model">
                            <Select
                                defaultFirst={false}
                                onLoadOptions={handleLoadModelOptions}
                                reloadKey={provider?.id}
                            />
                        </FormItem>
                    </Form>
                </Segment>
            </Modal>
        </div>
    );
}

export default ModelSettings;
