import { z } from 'zod';

const MAX_CHAT_MESSAGES = 100;
const MAX_MESSAGE_CONTENT_LENGTH = 32_000;

export const chatInputMessageSchema = z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().trim().min(1).max(MAX_MESSAGE_CONTENT_LENGTH),
});

export const chatRequestSchema = z
    .object({
        messages: z.array(chatInputMessageSchema).min(1).max(MAX_CHAT_MESSAGES),
    })
    .refine((request) => request.messages.at(-1)?.role === 'user', {
        message: 'The last message must be a user message.',
        path: ['messages'],
    });

export type ChatInputMessage = z.infer<typeof chatInputMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;
