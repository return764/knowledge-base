import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./pages/root.tsx";
import Settings from "./pages/settings.tsx";
import BasicPageWrapper from "./pages/basic_page_wrapper.tsx";
import routes from "./routes/routes.tsx";
import {API} from "./package/api";
import PreferenceProvider from "./components/preference/context/PreferenceProvider";

// 初始化 preferences
const initPreferences = async () => {
    try {
        // 检查表是否为空
        const result = await API.preference.count();
        if (result === 0) {
            // 插入初始配置
            await API.preference.bulkInsert([{
                key: 'OPENAI_API_URL',
                type: 'input',
                value: { value: "" }
            }, {
                key: 'OPENAI_API_KEY',
                type: 'input',
                value: { value: "" }
            }])
        }

        const providers = await API.modelProvider.queryAll();
        if (providers.length === 0) {
            await API.modelProvider.bulkInsert([
                {
                    name: 'Ollama',
                    url: 'http://localhost:11434/v1',
                    api_key: ''
                }, {
                    name: 'SiliconFlow',
                    url: 'https://api.siliconflow.cn/v1',
                    api_key: ''
                }, {
                    name: 'OpenAI',
                    url: 'https://api.openai.com/v1',
                    api_key: ''
                }, {
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <PreferenceProvider>
            <RouterProvider router={router} />
        </PreferenceProvider>
    </React.StrictMode>,
);
