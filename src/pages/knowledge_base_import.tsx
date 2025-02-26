import {useEffect, useState} from 'react';
import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import Stepper from "../components/basic/stepper/stepper.tsx";
import {useCounter} from "ahooks";
import Input from "../components/basic/form/components/Input.tsx";
import Form, {useForm} from "../components/basic/form/form.tsx";
import FormItem from "../components/basic/form/form_item.tsx";
import Textarea from "../components/basic/form/components/textarea.tsx";
import Table, {Column} from "../components/basic/table/table.tsx";
import {Channel, invoke} from "@tauri-apps/api/core";
import {KnowledgeBase} from "../api/knowledge_base.ts";
import {API} from "../api";
import {Dataset, ProgressEvent} from "../api/dataset.ts";
import toast from "react-hot-toast";

type UploadTable = {
    name: string,
    status: string
}

const columns: Column<UploadTable>[] = [
    {
        header: '来源名',
        accessorKey: 'name'
    },
    {
        header: '状态',
        accessorKey: 'status'
    }
]

function KnowledgeBaseImport() {
    const navigate = useNavigate()
    const knowledgeBase = useLoaderData() as KnowledgeBase
    const [current, { inc, dec }] = useCounter(0, { min: 0, max: 2 })
    const [data, setData] = useState<UploadTable[]>();
    const [form] = useForm()

    const handleComplete = async () => {
        const onEvent = new Channel<ProgressEvent>()
        const datasetId = await API.dataset.insert<Dataset>({name: form.getFieldValue("name"), kb_id: knowledgeBase.id})

        onEvent.onmessage = (message: ProgressEvent) => {
            if (message.event === 'started') {
                changeProgressStatus(form.getFieldValue('name'), 'Processing')
            } else if (message.event === 'finished') {
                changeProgressStatus(form.getFieldValue('name'), 'Finished')
            }
        }

        try {
            await invoke('import_text', {datasetId, kbId: knowledgeBase.id, text: form.getFieldValue("value"), onEvent: onEvent})
        } catch (e) {
            toast.error("导入失败")
            await API.dataset.delete(datasetId)
            return
        }
        toast.success("导入成功")
        navigate(-1)
    }

    const changeProgressStatus = (name: string, status: string) => {
        const dataCloned: UploadTable[] = JSON.parse(JSON.stringify(data))
        dataCloned.find(it => it.name === name)!!.status = status
        setData(dataCloned)
    }

    useEffect(() => {
        setData([{
            name: form.getFieldValue('name'),
            status: 'Pending'
        }])
    }, [current === 1])

    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="flex">
                        <Button onClick={() => {
                            navigate(-1)
                        }} icon={MdOutlineArrowBackIosNew} type="text"/>
                        <div className="text-primary text-xl leading-none my-auto">返回</div>
                    </div>
                </div>
            </div>
            <div>
                <Stepper current={current} items={['选择文件', '参数设置', '上传数据']}/>
                <div className={"mt-4"}>
                    {
                        <div className={`${current !== 0 ? 'hidden': ''}`}>
                            <Form form={form}>
                                <FormItem name={"name"} label={"数据集名称"}>
                                    <Input/>
                                </FormItem>
                                <FormItem name={"value"} label={"数据文本"}>
                                    <Textarea rows={10}/>
                                </FormItem>
                            </Form>
                        </div>
                    }
                    {
                        current === 1 && <div>
                            暂时为空
                      </div>
                    }
                    {
                        current === 2 && <div>
                            <Table<UploadTable> columns={columns} data={data}/>
                      </div>
                    }
                </div>
                <div className="flex justify-end gap-3 mt-5">
                    <Button type="light" className={`${current === 0 ? 'hidden' : ''}`} onClick={() => {
                        dec()
                    }}>上一步</Button>
                    <Button className={`${current === 2 ? 'hidden' : ''}`} onClick={() => {
                        inc()
                    }}>下一步</Button>
                    <Button className={`${current === 2 ? '' : 'hidden'}`} onClick={handleComplete}>完成</Button>
                </div>
            </div>
        </div>
    );
}

export default KnowledgeBaseImport;
