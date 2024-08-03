import React from 'react';
import Button from "../components/basic/button/button.tsx";
import {BiImport} from "react-icons/bi";

function KnowledgeBaseDetail(props) {
    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="text-primary text-xl leading-none my-auto">我的知识库</div>
                    <div><Button onClick={()=>{}} icon={BiImport}>导入</Button></div>
                </div>
            </div>
        </div>
    );
}

export default KnowledgeBaseDetail;
