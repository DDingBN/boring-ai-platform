import { Router } from 'express';
import { randomUUID } from 'node:crypto';

export const chatRouter = Router();

interface ChatInputMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface ChatRequest {
    messages: ChatInputMessage[];
}

interface ChatResponse {
    message: ChatInputMessage & {
        id: string;
        createdAt: string;
    };
}

chatRouter.post('/', (req, res) => {
    const request = req.body as ChatRequest;

    const lastMessage = request.messages.at(-1);

    if (!lastMessage || lastMessage.role !== 'user') {
        const error = new Error('The last message must be a user message.') as Error & {
            status: number;
        };

        error.status = 400;
        throw error;
    }

    const response: ChatResponse = {
        message: {
            id: randomUUID(),
            role: 'assistant',
            content: `Server 已收到：${lastMessage.content}`,
            createdAt: new Date().toISOString(),
        },
    };

    res.status(200).json(response);
});
