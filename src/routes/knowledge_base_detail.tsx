import React from 'react';
import Button from "../components/basic/button/button.tsx";
import {BiImport} from "react-icons/bi";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {KnowledgeBase} from "../model/knowledge_base.ts";
import {useQuery} from "../hooks/useQuery.ts";
import {Dataset} from "../model/dataset.ts";
import Table from "../components/basic/table/table.tsx";


const columns = [
    {header: '名称', name: 'name'},
    {header: '数据总量', name: 'count'},
    {header: '启用', name: 'active'}
]

function KnowledgeBaseDetail(props) {
    const navigate = useNavigate();
    const knowledgeBase = useLoaderData() as KnowledgeBase
    const {data, error} = useQuery<Dataset[]>('dataset', 'queryAllByKbId', {kb_id: knowledgeBase.id})

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
                        <div className="text-primary text-xl leading-none my-auto">{knowledgeBase.name}</div>
                    </div>
                    <div><Button onClick={handleImport} icon={BiImport}>导入文本</Button></div>
                </div>
            </div>
            <div>
                <Table<Dataset> columns={columns} data={data} onRowClick={handleRowClick}/>
            </div>
        </div>
    );
}

export default KnowledgeBaseDetail;
