import {AiFillOpenAI} from "react-icons/ai";
import {LLMProviderConfig} from "./config.ts";
import {DefaultOpenAiProviderAPI} from "./default.ts";

export class OpenAIProvider extends DefaultOpenAiProviderAPI {
    static {
        LLMProviderConfig.registerProvider("OpenAI", AiFillOpenAI)
    }
}
