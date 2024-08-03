import React from "react";
import ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Root from "./routes/root.tsx";
import KnowledgeBasePage from "./routes/knowledge_base.tsx";
import KnowledgeBaseDetail from "./routes/knowledge_base_detail.tsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        children: [
            {
                path: "/knowledge-base",
                element: <KnowledgeBasePage/>
            },
            {
                path: "/knowledge-base/:id",
                element: <KnowledgeBaseDetail/>
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
);
