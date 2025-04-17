// Ref: https://siliconflow.cn/zh-cn/models
export const siliconflowModelConfigs =
    {
        "THUDM/GLM-Z1-32B-0414": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "GLM-Z1-32B-0414 是一个具有深度思考能力的推理模型。该模型基于 GLM-4-32B-0414 通过冷启动和扩展强化学习开发，并在数学、代码和逻辑任务上进行了进一步训练。与基础模型相比，GLM-Z1-32B-0414 显著提升了数学能力和解决复杂任务的能力。在训练过程中，研究团队还引入了基于成对排序反馈的通用强化学习，进一步增强了模型的通用能力。虽然只有 32B 参数，但在部分任务上，其性能已能与拥有 671B 参数的 DeepSeek-R1 相媲美。通过在 AIME 24/25、LiveCodeBench、GPQA 等基准测试中的评估，该模型展现了较强的数理推理能力，能够支持解决更广泛复杂任务"
        },
        "Pro/deepseek-ai/DeepSeek-V3": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "新版 DeepSeek-V3 （DeepSeek-V3-0324）与之前的 DeepSeek-V3-1226 使用同样的 base 模型，仅改进了后训练方法。新版 V3 模型借鉴 DeepSeek-R1 模型训练过程中所使用的强化学习技术，大幅提高了在推理类任务上的表现水平，在数学、代码类相关评测集上取得了超过 GPT-4.5 的得分成绩。此外该模型在工具调用、角色扮演、问答闲聊等方面也得到了一定幅度的能力提升。"
        },
        "deepseek-ai/DeepSeek-R1": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "DeepSeek-R1 是一款强化学习（RL）驱动的推理模型，解决了模型中的重复性和可读性问题。在 RL 之前，DeepSeek-R1 引入了冷启动数据，进一步优化了推理性能。它在数学、代码和推理任务中与 OpenAI-o1 表现相当，并且通过精心设计的训练方法，提升了整体效果。"
        },
        "Qwen/QwQ-32B": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "QwQ 是 Qwen 系列的推理模型。与传统的指令调优模型相比，QwQ 具备思考和推理能力，能够在下游任务中实现显著增强的性能，尤其是在解决困难问题方面。QwQ-32B 是中型推理模型，能够在与最先进的推理模型（如 DeepSeek-R1、o1-mini）的对比中取得有竞争力的性能。该模型采用 RoPE、SwiGLU、RMSNorm 和 Attention QKV bias 等技术，具有 64 层网络结构和 40 个 Q 注意力头（GQA 架构中 KV 为 8 个）"
        },
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "DeepSeek-R1-Distill-Qwen-32B 是基于 Qwen2.5-32B 通过知识蒸馏得到的模型。该模型使用 DeepSeek-R1 生成的 80 万个精选样本进行微调，在数学、编程和推理等多个领域展现出卓越的性能。在 AIME 2024、MATH-500、GPQA Diamond 等多个基准测试中都取得了优异成绩，其中在 MATH-500 上达到了 94.3% 的准确率，展现出强大的数学推理能力"
        },
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "DeepSeek-R1-Distill-Qwen-14B 是基于 Qwen2.5-14B 通过知识蒸馏得到的模型。该模型使用 DeepSeek-R1 生成的 80 万个精选样本进行微调，展现出优秀的推理能力。在多个基准测试中表现出色，其中在 MATH-500 上达到了 93.9% 的准确率，在 AIME 2024 上达到了 69.7% 的通过率，在 CodeForces 上获得了 1481 的评分，显示出在数学和编程领域的强大实力"
        },
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "DeepSeek-R1-Distill-Qwen-7B 是基于 Qwen2.5-Math-7B 通过知识蒸馏得到的模型。该模型使用 DeepSeek-R1 生成的 80 万个精选样本进行微调，展现出优秀的推理能力。在多个基准测试中表现出色，其中在 MATH-500 上达到了 92.8% 的准确率，在 AIME 2024 上达到了 55.5% 的通过率，在 CodeForces 上获得了 1189 的评分，作为 7B 规模的模型展示了较强的数学和编程能力"
        },
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "DeepSeek-R1-Distill-Qwen-1.5B 是基于 Qwen2.5-Math-1.5B 通过知识蒸馏得到的模型。该模型使用 DeepSeek-R1 生成的 80 万个精选样本进行微调，在多个基准测试中展现出不错的性能。作为一个轻量级模型，在 MATH-500 上达到了 83.9% 的准确率，在 AIME 2024 上达到了 28.9% 的通过率，在 CodeForces 上获得了 954 的评分，显示出超出其参数规模的推理能力"
        },
        "deepseek-ai/DeepSeek-V2.5": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "DeepSeek-V2.5-1210 是 DeepSeek-V2.5 的升级版本，在多个能力方面都有显著提升。在数学能力方面，其在 MATH-500 基准测试上的表现从 74.8% 提升至 82.8%；在编程方面，LiveCodebench 基准测试的准确率从 29.2% 提升至 34.38%。同时在写作和推理方面也有明显改进。模型支持函数调用、JSON 输出和填充式补全等多种功能"
        },
        "Qwen/Qwen2.5-72B-Instruct-128K": {
            "maxTokens": 128000,
            "type": "chat",
            "notes": "Qwen2.5-72B-Instruct 是阿里云发布的最新大语言模型系列之一。该 72B 模型在编码和数学等领域具有显著改进的能力。它支持长达 128K tokens 的上下文。该模型还提供了多语言支持，覆盖超过 29 种语言，包括中文、英文等。模型在指令跟随、理解结构化数据以及生成结构化输出（尤其是 JSON）方面都有显著提升"
        },
        "Qwen/Qwen2.5-72B-Instruct": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "Qwen2.5-72B-Instruct 是阿里云发布的最新大语言模型系列之一。该 72B 模型在编码和数学等领域具有显著改进的能力。该模型还提供了多语言支持，覆盖超过 29 种语言，包括中文、英文等。模型在指令跟随、理解结构化数据以及生成结构化输出（尤其是 JSON）方面都有显著提升"
        },
        "Qwen/Qwen2.5-32B-Instruct": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "Qwen2.5-32B-Instruct 是阿里云发布的最新大语言模型系列之一。该 32B 模型在编码和数学等领域具有显著改进的能力。该模型还提供了多语言支持，覆盖超过 29 种语言，包括中文、英文等。模型在指令跟随、理解结构化数据以及生成结构化输出（尤其是 JSON）方面都有显著提升"
        },
        "Qwen/Qwen2.5-14B-Instruct": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "Qwen2.5-14B-Instruct 是阿里云发布的最新大语言模型系列之一。该 14B 模型在编码和数学等领域具有显著改进的能力。该模型还提供了多语言支持，覆盖超过 29 种语言，包括中文、英文等。模型在指令跟随、理解结构化数据以及生成结构化输出（尤其是 JSON）方面都有显著提升"
        },
        "Qwen/Qwen2.5-7B-Instruct": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "Qwen2.5-7B-Instruct 是阿里云发布的最新大语言模型系列之一。该 7B 模型在编码和数学等领域具有显著改进的能力。该模型还提供了多语言支持，覆盖超过 29 种语言，包括中文、英文等。模型在指令跟随、理解结构化数据以及生成结构化输出（尤其是 JSON）方面都有显著提升"
        },
        "Qwen/Qwen2.5-Coder-7B-Instruct": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "Qwen2.5-Coder-7B-Instruct 是阿里云发布的代码特定大语言模型系列的最新版本。该模型在 Qwen2.5 的基础上，通过 5.5 万亿个 tokens 的训练，显著提升了代码生成、推理和修复能力。它不仅增强了编码能力，还保持了数学和通用能力的优势。模型为代码智能体等实际应用提供了更全面的基础"
        },
        "internlm/internlm2_5-20b-chat": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "InternLM2.5-20B-Chat 是一个开源的大规模对话模型，基于 InternLM2 架构开发。该模型拥有 200 亿参数，在数学推理方面表现出色，超越了同量级的 Llama3 和 Gemma2-27B 模型。InternLM2.5-20B-Chat 在工具调用能力方面有显著提升，支持从上百个网页收集信息进行分析推理，并具备更强的指令理解、工具选择和结果反思能力。它适用于构建复杂智能体，可进行多轮工具调用以完成复杂任务"
        },
        "internlm/internlm2_5-7b-chat": {
            "maxTokens": 32768,
            "type": "chat",
            "notes": "InternLM2.5-7B-Chat 是一个开源的对话模型，基于 InternLM2 架构开发。该 7B 参数规模的模型专注于对话生成任务，支持中英双语交互。模型采用了最新的训练技术，旨在提供流畅、智能的对话体验。InternLM2.5-7B-Chat 适用于各种对话应用场景，包括但不限于智能客服、个人助手等领域"
        },
    }
export type Model = keyof typeof siliconflowModelConfigs
export const models = Array.from(Object.keys(siliconflowModelConfigs)).sort() as Model[]
