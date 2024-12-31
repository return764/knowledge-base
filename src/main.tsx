import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./pages/root.tsx";
import Settings from "./pages/settings.tsx";
import BasicPageWrapper from "./pages/basic_page_wrapper.tsx";
import routes from "./routes/routes.tsx";
import {API} from "./api";
import PreferenceProvider from "./components/preference/context/PreferenceProvider";

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
                value: { value: "" }
            }, {
                key: 'OPENAI_API_KEY',
                type: 'input',
                value: { value: "" }
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
        <PreferenceProvider>
            <RouterProvider router={router} />
        </PreferenceProvider>
    </React.StrictMode>,
);
