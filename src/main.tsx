import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/root.tsx";
import KnowledgeBasePage from "./routes/knowledge_base.tsx";
import KnowledgeBaseDetail from "./routes/knowledge_base_detail.tsx";
import {API} from "./model";
import KnowledgeBaseImport from "./routes/knowledge_base_import.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/knowledge-base",
                element: <KnowledgeBasePage/>
            }, {
                path: "/knowledge-base/:id",
                element: <KnowledgeBaseDetail/>,
                loader: async ({ params }) => {
                    return await API.knowledgeBase.queryById(params['id']!!)
                },
            }, {
                path: "/knowledge-base/:id/import",
                element: <KnowledgeBaseImport/>,
                loader: async ({ params }) => {
                    return await API.knowledgeBase.queryById(params['id']!!)
                },
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);
