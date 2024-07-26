import {RiHome3Line} from "react-icons/ri";
import {LuFiles} from "react-icons/lu";
import {Link, useLocation} from "react-router-dom";

function Navigations() {
    const location = useLocation()

    const checkActive = (path) => {
        console.log(location.pathname)
        return path === location.pathname ? 'active': '';
    }

    const handleNavigate = (path) => {

    }

    return (
        <section className="flex flex-col min-h-screen bg-zinc-50">
            <div className="h-6"></div>
            <nav className="flex flex-col flex-1 justify-between w-44 p-2 select-none">
                <div className="flex flex-col gap-1">
                    <Link className={'group'} to={'/'}>
                        <section
                            className={`flex flex-row justify-start px-2 py-0.5 group-active:bg-neutral-200 hover:bg-neutral-100 rounded-md cursor-pointer ${checkActive("/")}`}>
                            <div className="mr-0.5 my-auto"><RiHome3Line
                                className="text-color group-active:bg-neutral-200" size={16}/>
                            </div>
                            <div className="text-color group-active:bg-neutral-200">首页</div>
                        </section>
                    </Link>
                    <Link className={'group'} to={'/knowledge-base'}>
                        <section
                            className={`flex flex-row justify-start px-2 py-0.5 group-active:bg-neutral-200 hover:bg-neutral-100 rounded-md cursor-pointer ${checkActive("/knowledge-base")}`}>
                            <div className="mr-0.5 my-auto">
                                <LuFiles className="text-color group-active:bg-neutral-200" size={16}/>
                            </div>
                            <div className="text-color group-active:bg-neutral-200">知识库</div>
                        </section>
                    </Link>
                </div>
                <div>设置</div>
            </nav>
        </section>
    );
}

export default Navigations;
