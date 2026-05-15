export interface AiModelConfig {
    provider: string;
    model: string;
}

export interface AiTextMessage {
    role: 'system' | 'user' | 'assistant' | 'tool';
    content: string;
}

export interface AiTextGenerationRequest {
    model: AiModelConfig;
    messages: AiTextMessage[];
}
