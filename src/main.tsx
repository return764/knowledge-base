import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/root.tsx";
import Settings from "./routes/settings.tsx";
import BasicPageWrapper from "./routes/basic_page_wrapper.tsx";
import routes from "./routes/routes.tsx";
import {API} from "./model";

// 初始化 preferences
const initPreferences = async () => {
    try {
        // 检查表是否为空
        const result = await API.preference.getCount();
        if (result === 0) {
            // 插入初始配置
            await API.preference.batchInsert([{
                key: 'OPENAI_API_URL',
                type: 'input',
                value: JSON.stringify({ value: "" })
            }, {
                key: 'OPENAI_API_KEY',
                type: 'input',
                value: JSON.stringify({ value: "" })
            }])
        }
    } catch (e) {
        console.error('Failed to initialize preferences:', e)
    }
}


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/",
                element: <BasicPageWrapper/>,
                children: routes
            }, {
                path: "/settings",
                element: <Settings/>,
            }
        ],
    }
]);

initPreferences()

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);
