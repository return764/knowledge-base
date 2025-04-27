import {ExpandedCard} from "../components/expanded-card/ExpandedCard.tsx";
import {useQuery} from "../hooks/useQuery.ts";
import {KnowledgeBase} from "../package/api/knowledge_base.ts";
import Button from "../components/basic/button/button.tsx";
import {FaPlus} from "react-icons/fa6";
import Modal from "../components/basic/modal/modal.tsx";
import Input from "../components/basic/form/components/Input.tsx";
import {API} from "../package/api";
import toast from "react-hot-toast";
import {useToggle} from "ahooks";
import Form, {useForm} from "../components/basic/form/form.tsx";
import FormItem from "../components/basic/form/form_item.tsx";
import Select from "../components/basic/form/components/select.tsx";
import {useMemo} from "react";
import {LLMModel} from "../package/api/model.ts";

function KnowledgeBasePage() {
    const {data} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')
    const {data: activeModels} = useQuery<LLMModel[]>('model', 'queryAllActiveModel')
    const [visible, {toggle}] = useToggle(false)
    const [form] = useForm();

    const modelOptions = useMemo(() => {
        return (activeModels ?? []).filter(it => it.type === "embedding").map((model: LLMModel) => ({
            label: model.name,
            value: model.id
        }))
    }, [activeModels])


    const handleSubmitNewKB = async () => {
        await API.knowledgeBase.insert({
            name: form.getFieldValue("name"),
            embedding_model_id: form.getFieldValue('embedding_model_id')
        })
        toast.success("创建知识库成功!")
    }

    const handleOpenAddKBModal = () => {
        toggle()
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between mb-2">
                <div className="text-primary text-xl leading-none my-auto">我的知识库</div>
                <div><Button onClick={handleOpenAddKBModal} icon={FaPlus}>新建</Button></div>
            </div>
            <section className='relative flex flex-grow flex-col flex-flow h-0 overflow-y-scroll'>
                <section className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                    {data?.map((it, index) => {
                        return <ExpandedCard key={index} knowledgeBase={it}/>
                    })}
                </section>
            </section>
            <Modal title={"新建知识库"} onClose={toggle} open={visible} onConfirm={handleSubmitNewKB}>
                <Form form={form}>
                    <FormItem name={"name"} label={"知识库名"}>
                        <Input size={"small"}/>
                    </FormItem>
                    <FormItem name={"embedding_model_id"} label={"文本嵌入模型"}>
                        <Select
                            options={modelOptions}
                        />
                    </FormItem>
                </Form>
            </Modal>
        </div>
    )
}

export default KnowledgeBasePage;
