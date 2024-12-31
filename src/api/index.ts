import {KnowledgeBaseAPI} from "./knowledge_base.ts";
import {DatasetAPI} from "./dataset.ts";
import {ChatAPI} from "./chat.ts";
import {PreferenceAPI} from "./preference.ts";

export const API = {
    'knowledgeBase': new KnowledgeBaseAPI(),
    'dataset': new DatasetAPI(),
    'chat': new ChatAPI(),
    'preference': new PreferenceAPI()
}
