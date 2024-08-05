import React, {useEffect, useState} from 'react';
import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import Stepper from "../components/basic/stepper/stepper.tsx";
import {useCounter} from "ahooks";
import Input from "../components/basic/form/components/Input.tsx";
import Form, {useForm} from "../components/basic/form/form.tsx";
import FormItem from "../components/basic/form/form_item.tsx";
import Textarea from "../components/basic/form/components/textarea.tsx";
import Table from "../components/basic/table/table.tsx";

type UploadTable = {
    name: string,
    status: string
}

const columns = [
    {header: '来源名', name: 'name'},
    {header: '状态', name: 'status'}
]

function KnowledgeBaseImport(props) {
    const navigate = useNavigate()
    const [current, { inc, dec }] = useCounter(0, { min: 0, max: 2 })
    const [data, setData] = useState<UploadTable[]>();
    const [form] = useForm()

    const handleComplete = () => {
        console.log(form.getFieldValues())
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
