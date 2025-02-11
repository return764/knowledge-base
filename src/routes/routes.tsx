import KnowledgeBasePage from "../pages/knowledge_base.tsx";
import KnowledgeBaseDetail from "../pages/knowledge_base_detail.tsx";
import {API} from "../api";
import KnowledgeBaseImport from "../pages/knowledge_base_import.tsx";
import Datasets from "../pages/datasets.tsx";
import Chats from "../pages/chats.tsx";
import ChatPage from "../pages/chat_page.tsx";

export default [
    {
        path: "/knowledge-base",
        element: <KnowledgeBasePage/>,
    }, {
        path: "/knowledge-base/:id",
        element: <KnowledgeBaseDetail/>,
        loader: async ({ params }: { params: any }) => {
            return await API.knowledgeBase.queryById(params['id']!!)
        },
    }, {
        path: "/knowledge-base/:id/import",
        element: <KnowledgeBaseImport/>,
        loader: async ({ params }: { params: any }) => {
            return await API.knowledgeBase.queryById(params['id']!!)
        },
    }, {
        path: "/knowledge-base/:id/dataset/:datasetId",
        element: <Datasets/>,
        loader: async ({params}: { params: any }) => {
            return await API.dataset.queryAllDocumentsByDatasetId(params['datasetId']!!)
        }
    }, {
        path: "/chats",
        element: <Chats/>,
    }, {
        path: "/chats/:id",
        element: <ChatPage/>,
        loader: async ({params}: { params: any }) => {
            return await API.chat.queryById(params['id']!!)
        }
    }
]
