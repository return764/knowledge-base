import {RiHome3Line} from "react-icons/ri";
import {LuFiles} from "react-icons/lu";
import {Link, useLocation, useResolvedPath} from "react-router-dom";
import React from "react";
import {IconType} from "react-icons";

function useRouteMatch(link: string | undefined) {
    let location = useLocation();
    let path = useResolvedPath(link || "");

    let locationPathname = location.pathname;
    let toPathname = path.pathname;
    locationPathname = locationPathname.toLowerCase();
    toPathname = toPathname.toLowerCase();

    return (
        locationPathname === toPathname ||
        (locationPathname.startsWith(toPathname) &&
            locationPathname.charAt(toPathname.length) === "/")
    );
}

type NavItemProps = {
    link: string,
    icon: IconType,
    name: string
}

const NavItem = (props: NavItemProps) => {
    let isActive = useRouteMatch(props.link || "");

    return (
        <Link className={'group/item'} to={props.link}>
            <section
                className={`flex flex-row justify-start px-2 py-0.5 group-active/item:bg-neutral-200 hover:bg-neutral-100 rounded-md cursor-pointer ${isActive ? 'active' : ''}`}>
                <div className="mr-0.5 my-auto">
                    <props.icon className="text-color group-active/item:bg-neutral-200" size={16}/>
                </div>
                <div className="text-color group-active/item:bg-neutral-200 grow">{props.name}</div>
            </section>
        </Link>
    )
}

function Navigations() {

    const handleNavigate = (path) => {

    }

    return (
        <section className="flex flex-col min-h-screen bg-zinc-50">
            <div className="h-6"></div>
            <nav className="flex flex-col flex-1 justify-between w-44 p-2 select-none">
                <div className="flex flex-col gap-1">
                    <NavItem link={"/"} icon={RiHome3Line} name="首页"/>
                    <NavItem link={"/knowledge-base"} icon={LuFiles} name="知识库"/>
                </div>
                <div>设置</div>
            </nav>
        </section>
    );
}

export default Navigations;
