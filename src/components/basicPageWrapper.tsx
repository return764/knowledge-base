import {Outlet} from "react-router-dom";

function BasicPageWrapper() {
    return (
        <>
            <div className="h-6 shrink-0"></div>
            <div className="flex flex-col flex-1 p-4">
                <Outlet/>
            </div>
        </>
    );
}

export default BasicPageWrapper;
