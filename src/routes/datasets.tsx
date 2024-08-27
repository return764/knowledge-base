import React from 'react';
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import {Dataset, DocumentData} from "../model/dataset.ts";
import Button from "../components/basic/button/button.tsx";
import {MdOutlineArrowBackIosNew} from "react-icons/md";
import {BiImport} from "react-icons/bi";
import {useQuery} from "../hooks/useQuery.ts";
import DocumentCard from "../components/document-card/DocumentCard.tsx";

function Datasets(props) {
    const documents = useLoaderData() as DocumentData[]
    const {datasetId} = useParams();
    const {data: dataset, error} = useQuery<Dataset>('dataset', 'queryById', {id: datasetId})
    const navigate = useNavigate()

    return (
        <div>
            <div>
                <div className="flex justify-between mb-2">
                    <div className="flex">
                        <Button onClick={() => {
                            navigate(-1)
                        }} icon={MdOutlineArrowBackIosNew} type="text"/>
                        <div className="text-primary text-xl leading-none my-auto">
                            { dataset?.name }
                        </div>
                    </div>
                    <div><Button onClick={() => {}} icon={BiImport}>插入</Button></div>
                </div>
            </div>
            <section className='relative'>
                <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                    {documents?.map((it, index) => {
                        return <DocumentCard key={index} index={index} document={it}/>
                    })}
                </section>
            </section>
        </div>
    );
}

export default Datasets;
