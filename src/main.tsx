import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./pages/root.tsx";
import Settings from "./pages/settings.tsx";
import BasicPageWrapper from "./pages/basic_page_wrapper.tsx";
import routes from "./routes/routes.tsx";
import {API} from "./api";
import PreferenceProvider from "./components/preference/context/PreferenceProvider";
import {invoke} from "@tauri-apps/api/core";

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

        const providers = await API.model.queryAllProvider();
        if (providers.length === 0) {
            await API.model.insertProviders([
                {
                    id: await invoke("uuid"),
                    name: 'Ollama',
                    url: 'http://localhost:11434/v1',
                    api_key: ''
                }, {
                    id: await invoke("uuid"),
                    name: 'SiliconFlow',
                    url: 'https://api.siliconflow.cn/v1',
                    api_key: ''
                }, {
                    id: await invoke("uuid"),
                    name: 'OpenAI',
                    url: 'https://api.openai.com/v1',
                    api_key: ''
                }, {
                    id: await invoke("uuid"),
                    name: 'Qwen',
                    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
                    api_key: ''
                }
            ])
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
invoke("init_vec_db")

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <PreferenceProvider>
            <RouterProvider router={router} />
        </PreferenceProvider>
    </React.StrictMode>,
);
