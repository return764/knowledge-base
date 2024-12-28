import KnowledgeBasePage from "./knowledge_base.tsx";
import KnowledgeBaseDetail from "./knowledge_base_detail.tsx";
import {API} from "../model";
import KnowledgeBaseImport from "./knowledge_base_import.tsx";
import Datasets from "./datasets.tsx";
import Chats from "./chats.tsx";
import ChatPage from "./chat_page.tsx";

export default [
    {
        path: "/knowledge-base",
        element: <KnowledgeBasePage/>,
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
    }, {
        path: "/knowledge-base/:id/dataset/:datasetId",
        element: <Datasets/>,
        loader: async ({params}) => {
            return await API.dataset.queryAllDocumentsByDatasetId(params['id']!!, params['datasetId']!!)
        }
    }, {
        path: "/chats",
        element: <Chats/>,
    }, {
        path: "/chats/:id",
        element: <ChatPage/>,
        loader: async ({params}) => {
            return await API.chat.queryById(params['id']!!)
        }
    }
]
