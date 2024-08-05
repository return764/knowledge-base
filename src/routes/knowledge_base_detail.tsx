import React, {useState} from 'react';
import Button from "../components/basic/button/button.tsx";
import {BiImport} from "react-icons/bi";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {useLoaderData, useNavigate} from "react-router-dom";
import {KnowledgeBase} from "../model/knowledge_base.ts";

function KnowledgeBaseDetail(props) {
    const navigate = useNavigate();
    const knowledgeBase = useLoaderData() as KnowledgeBase


    const handleImport = async () => {
        navigate("import")
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

            </div>
        </div>
    );
}

export default KnowledgeBaseDetail;
