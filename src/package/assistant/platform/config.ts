import {ComponentType} from "react";

export type ProviderConfig = {
    name: string;
    url: string;
    api_key: string;
}

export const PROVIDER_CONFIGS: ProviderConfig[] = [
    {
        name: 'OpenAI',
        url: 'https://api.openai.com/v1',
        api_key: '',
    },
    {
        name: 'SiliconFlow',
        url: 'https://api.siliconflow.cn/v1',
        api_key: '',
    },
    {
        name: 'Ollama',
        url: 'http://localhost:11434/v1',
        api_key: '',
    },
    {
        name: 'Qwen',
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        api_key: '',
    }
];

export class LLMProviderConfig {
    static providerMap: Record<string, { name: string, icon: ComponentType }> = {};

    static registerProvider(name: string, icon: ComponentType) {
        LLMProviderConfig.providerMap[name] = {
            name,
            icon
        };
    }

    static getProviderOptions(): any {
        return Object.values(this.providerMap).map(provider => ({
            value: provider.name,
            icon: provider.icon,
            label: provider.name
        }))
    }
}
