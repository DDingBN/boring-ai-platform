import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { chatRequestSchema, type ChatInputMessage } from './chat.schema';

export const chatRouter = Router();

interface ChatResponse {
    message: ChatInputMessage & {
        id: string;
        createdAt: string;
    };
}

chatRouter.post('/', (req, res) => {
    const result = chatRequestSchema.safeParse(req.body);

    if (!result.success) {
        const error = new Error('Invalid chat request.', { cause: result.error }) as Error & {
            status: number;
        };

        error.status = 400;
        throw error;
    }

    const lastMessage = result.data.messages.at(-1)!;

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
