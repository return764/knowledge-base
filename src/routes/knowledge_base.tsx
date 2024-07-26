import React, {useEffect, useRef} from 'react';
import {ExpandedCard} from "../components/expanded-card/ExpandedCard.tsx";
import {useQuery} from "../hooks/useQuery.ts";
import {KnowledgeBase} from "../model/knowledge_base.ts";

function KnowledgeBasePage(props) {
    const {data, error} = useQuery<KnowledgeBase[]>('knowledgeBase', 'queryAll')
    const bodyRef = useRef<Element>();

    useEffect(() => {
        bodyRef.current = document.body;
    }, []);

    return (
        <div>
            <div>
                <div>知识库</div>
                <section className='relative overflow-x-auto overflow-y-visible py-6 no-scrollbar'>
                    <section className="flex w-fit mt-2 snap-mandatory -space-x-32 snap-x pl-4">
                        {data?.map((it, index) => {
                            return <ExpandedCard index={index}/>
                        })}
                    </section>
                </section>
            </div>
            {/*{*/}
            {/*    bodyRef.current && createPortal(*/}
            {/*        <div*/}
            {/*            className="overflow-y-auto overflow-x-hidden fixed backdrop-blur-sm top-0 right-0 left-0 z-50 justify-center items-center w-full h-full">*/}
            {/*            <div className="h-30 w-52 bg-zinc-50">*/}
            {/*                caskdkalsdjkasdasds*/}
            {/*            </div>*/}
            {/*        </div>,*/}
            {/*        bodyRef.current!!*/}
            {/*    )*/}
            {/*}*/}
        </div>
    )
}

export default KnowledgeBasePage;
