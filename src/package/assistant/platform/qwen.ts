import QwenSvg from "../../../assets/qwen.svg?react";
import {LLMProviderConfig} from "./config.ts";
import {DefaultOpenAiProviderAPI} from "./default.ts";

export class QwenProvider extends DefaultOpenAiProviderAPI {
    static {
        LLMProviderConfig.registerProvider("Qwen", QwenSvg)
    }
}
