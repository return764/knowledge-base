import {RiHome3Line} from "react-icons/ri";
import {LuFiles} from "react-icons/lu";
import {Link, useLocation} from "react-router-dom";
import {FaPlus} from "react-icons/fa6";
import {useToggle} from "ahooks";
import Modal from "./basic/modal/modal.tsx";
import React, {useState} from "react";
import Input from "./basic/form/Input.tsx";
import {API} from "../model";
import toast from "react-hot-toast";

function Navigations() {
    const location = useLocation()

    const checkActive = (path) => {
        return path === location.pathname ? 'active': '';
    }


    const handleNavigate = (path) => {

    }

    return (
        <section className="flex flex-col min-h-screen bg-zinc-50">
            <div className="h-6"></div>
            <nav className="flex flex-col flex-1 justify-between w-44 p-2 select-none">
                <div className="flex flex-col gap-1">
                    <Link className={'group/item'} to={'/'}>
                        <section
                            className={`flex flex-row justify-start px-2 py-0.5 group-active/item:bg-neutral-200 hover:bg-neutral-100 rounded-md cursor-pointer ${checkActive("/")}`}>
                            <div className="mr-0.5 my-auto">
                                <RiHome3Line className="text-color group-active/item:bg-neutral-200" size={16}/>
                            </div>
                            <div className="text-color group-active/item:bg-neutral-200 grow">首页</div>
                        </section>
                    </Link>
                    <Link className="group/item" to={'/knowledge-base'}>
                        <section
                            className={`flex flex-row justify-start px-2 py-0.5 group-active/item:bg-neutral-200 hover:bg-neutral-100 rounded-md cursor-pointer ${checkActive("/knowledge-base")}`}>
                            <div className="mr-0.5 my-auto">
                                <LuFiles className="text-color group-active/item:bg-neutral-200" size={16}/>
                            </div>
                            <div
                                className="text-color group-active/item:bg-neutral-200 grow">知识库</div>
                            <div
                                className="icon hidden group-hover/item:flex group-hover/item:visible group/add">
                                <div
                                    className="my-auto p-0.5 rounded-md group-active/item:bg-neutral-200 group-hover/add:bg-neutral-200">
                                    <FaPlus
                                        className="text-color group-active/item:bg-neutral-200 group-hover/add:bg-neutral-200"
                                        size={14}/>
                                </div>
                            </div>
                        </section>
                    </Link>
                </div>
                <div>设置</div>
            </nav>
        </section>
    );
}

export default Navigations;
