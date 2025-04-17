import {KnowledgeBaseAPI} from "./knowledge_base.ts";
import {DatasetAPI} from "./dataset.ts";
import {ChatAPI} from "./chat.ts";
import {PreferenceAPI} from "./preference.ts";
import {ModelAPI} from "./model.ts";
import {ModelProviderAPI} from "./model_provider.ts";
import {ChatHistoryAPI} from "./chat_history.ts";

export const API = {
    'knowledgeBase': new KnowledgeBaseAPI(),
    'dataset': new DatasetAPI(),
    'chat': new ChatAPI(),
    'chatHistory': new ChatHistoryAPI(),
    'preference': new PreferenceAPI(),
    'model': new ModelAPI(),
    'modelProvider': new ModelProviderAPI(),
}
