import SiliconFlowSvg from "../../../assets/siliconflow.svg?react";
import {LLMProviderConfig} from "./config.ts";
import {DefaultOpenAiProviderAPI} from "./default.ts";

export class SiliconFlowProvider extends DefaultOpenAiProviderAPI {
    static {
        LLMProviderConfig.registerProvider("SiliconFlow", SiliconFlowSvg)
    }
}
