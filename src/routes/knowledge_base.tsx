import React, {useState} from 'react';
import {ExpandedCard} from "../components/expanded-card/ExpandedCard.tsx";
import {useQuery} from "../hooks/useQuery.ts";
import {KnowledgeBase} from "../model/knowledge_base.ts";
import Button from "../components/basic/button/button.tsx";
import {FaPlus} from "react-icons/fa6";
import Modal from "../components/basic/modal/modal.tsx";
import Input from "../components/basic/form/components/Input.tsx";
import {API} from "../model";
import toast from "react-hot-toast";
import {useToggle} from "ahooks";
import Form, {useForm} from "../components/basic/form/form.tsx";
import FormItem from "../components/basic/form/form_item.tsx";

function KnowledgeBasePage(props) {
    const {data, error} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')
    const [visible, {toggle}] = useToggle(false)
    const [knowledgeBaseName, setKnowLedgeBaseName] = useState<string>(null);
    const [form] = useForm();

    const handleSubmitNewKB = async () => {
        await API.knowledgeBase.insert({name: form.getFieldValue("name")})
        setKnowLedgeBaseName(null);
        toast.success("创建知识库成功!")
    }

    const handleOpenAddKBModal = () => {
        toggle()
    }

    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="text-primary text-xl leading-none my-auto">我的知识库</div>
                    <div><Button onClick={handleOpenAddKBModal} icon={FaPlus}>新建</Button></div>
                </div>
                <section className='relative'>
                    <section className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                        {data?.map((it, index) => {
                            return <ExpandedCard key={index} knowledgeBase={it}/>
                        })}
                    </section>
                </section>
            </div>
            <Modal title={"新建知识库"} onClose={toggle} open={visible} onConfirm={handleSubmitNewKB}>
                <Form form={form}>
                    <FormItem name={"name"} label={"知识库名"}>
                        <Input size={"small"}/>
                    </FormItem>
                </Form>
            </Modal>
        </div>
    )
}

export default KnowledgeBasePage;
