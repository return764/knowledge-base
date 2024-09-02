import Navigations from "../components/navigations.tsx";
import {Outlet} from "react-router-dom";
import {Toaster} from "react-hot-toast";

function Root() {

    return (
        <main className="flex max-h-screen">
            <Toaster/>
            <div className="fixed h-6 w-full z-50" data-tauri-drag-region={true}></div>
            <Navigations/>
            <section className="flex flex-col flex-1 overflow-scroll">
                <div className="h-6 shrink-0"></div>
                <div className="flex flex-col flex-1 p-4">
                    <Outlet/>
                </div>
            </section>
        </main>
    );
}

export default Root;
