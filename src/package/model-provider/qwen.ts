export const qwenModelConfigs =
    {
        "qwen-max": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "通义千问2.5系列千亿级别超大规模语言模型，支持中文、英文等不同语言输入。随着模型的升级，qwen-max将滚动更新升级。如果希望使用固定版本，请使用历史快照版本。"
        },
        "qwq-plus": {
            "maxTokens": 128000,
            "type": "chat",
            "notes": "通义千问QwQ推理模型增强版，基于Qwen2.5模型训练的QwQ推理模型，通过强化学习大幅度提升了模型推理能力。模型数学代码等核心指标（AIME 24/25、livecodebench）以及部分通用指标（IFEval、LiveBench等）达到DeepSeek-R1 满血版水平。"
        },
        "qwen-plus": {
            "maxTokens": 128000,
            "type": "chat",
            "notes": "通义千问超大规模语言模型的增强版，支持中文英文等不同语言输入。"
        },
        "qwen-turbo": {
            "maxTokens": 1000000,
            "type": "chat",
            "notes": "通义千问超大规模语言模型，支持中文英文等不同语言输入。"
        },
        "multimodal-embedding-v1": {
            "maxTokens": -1,
            "type": "embedding",
            "notes": "通义实验室基于预训练多模态大模型构建的多模态向量模型。该模型根据用户的输入生成高维连续向量，这些输入可以是文本、图片或视频。多模态向量在可应用于图片搜索、文搜图、视频搜索、图片分类和视频内容审核等下游任务中。"
        }
    }
export type Model = keyof typeof qwenModelConfigs
export const models = Array.from(Object.keys(qwenModelConfigs)).sort() as Model[]
