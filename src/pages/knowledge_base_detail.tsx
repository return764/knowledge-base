import {useState} from 'react';
import Button from "../components/basic/button/button.tsx";
import {BiImport} from "react-icons/bi";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import {KnowledgeBase} from "../api/knowledge_base.ts";
import {useQuery} from "../hooks/useQuery.ts";
import {Dataset} from "../api/dataset.ts";
import Table, {Column} from "../components/basic/table/table.tsx";
import Modal from "../components/basic/modal/modal.tsx";
import {useToggle} from "ahooks";
import {deleteDataset} from "../service/dataset.ts";


function KnowledgeBaseDetail() {
    const navigate = useNavigate()
    const [visible, {toggle}] = useToggle(false)
    const [current, setCurrent] = useState<Dataset>()
    const knowledgeBase = useLoaderData() as KnowledgeBase
    const {id} = useParams()
    const {data} = useQuery<Dataset[]>('dataset', 'queryAllByKbId', {kbId: id})

    const columns: Column<Dataset>[] = [
        {
            header: '名称',
            accessorKey: 'name'
        },
        {
            header: '数据总量',
            accessorKey: 'count'
        },
        {
            header: '启用',
            accessorKey: 'active'
        },
        {
            header: '动作',
            cell: (record) => {
                return <Button onClick={(e) => handleOpenDeleteConfirmModal(record.row.original, e)} type="light">删除</Button>
            }
        }
    ]

    const handleOpenDeleteConfirmModal = (record: Dataset, e: any) => {
        e.stopPropagation();
        setCurrent(record)
        toggle()
    }

    const handleConfirmDelete = async () => {
        await deleteDataset(current?.id!!)
    }

    const handleImport = async () => {
        navigate("import")
    }

    const handleRowClick = (row: Dataset) => {
        navigate(`dataset/${row.id}`)
    }

    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="flex">
                        <Button onClick={() => {navigate(-1)}} icon={MdOutlineArrowBackIosNew} type="text"/>
                        <div className="text-primary text-xl leading-none my-auto">{knowledgeBase?.name}</div>
                    </div>
                    <div><Button onClick={handleImport} icon={BiImport}>导入文本</Button></div>
                </div>
            </div>
            <div>
                <Table<Dataset> columns={columns} data={data} onRowClick={handleRowClick}/>
            </div>
            <Modal open={visible} onConfirm={handleConfirmDelete} onClose={toggle}>
                你确定要删除数据集以及其中训练的索引吗
            </Modal>
        </div>
    );
}

export default KnowledgeBaseDetail;
