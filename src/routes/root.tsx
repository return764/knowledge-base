import React from 'react';
import Navigations from "../components/navigations.tsx";
import {Outlet} from "react-router-dom";
import Modal from "../components/basic/modal/modal.tsx";
import {useToggle} from "ahooks";
import {Toaster} from "react-hot-toast";

function Root(props) {

    return (
        <main className="flex max-h-screen">
            <Toaster/>
            <div className="fixed h-6 w-full z-50" data-tauri-drag-region={true}></div>
            <Navigations/>
            <section className="flex-1 overflow-scroll">
                <div className="h-6"></div>
                <div className="p-4">
                    <Outlet/>
                </div>
            </section>
        </main>
    );
}

export default Root;
