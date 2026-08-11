import assert from 'node:assert/strict';
import type { AddressInfo } from 'node:net';
import test from 'node:test';
import type { Express } from 'express';
import { createApp } from './app';

interface TestResponse {
    body: unknown;
    headers: Headers;
    status: number;
}

async function request(app: Express, path: string, init?: RequestInit): Promise<TestResponse> {
    const server = app.listen(0, '127.0.0.1');

    try {
        await new Promise<void>((resolve, reject) => {
            server.once('listening', resolve);
            server.once('error', reject);
        });

        const address = server.address() as AddressInfo;
        const response = await fetch(`http://127.0.0.1:${address.port}${path}`, init);

        return {
            body: await response.json(),
            headers: response.headers,
            status: response.status,
        };
    } finally {
        await new Promise<void>((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve()));
        });
    }
}

test('createApp serves a clean liveness response without starting the configured server', async () => {
    const response = await request(createApp(), '/health');

    assert.equal(response.status, 200);
    assert.deepEqual(response.body, {
        code: 200,
        msg: 'success',
        data: { ok: true },
    });
    assert.match(response.headers.get('x-request-id') ?? '', /^req_[0-9a-f-]{36}$/);
});

test('preserves a valid caller request ID', async () => {
    const response = await request(createApp(), '/health', {
        headers: { 'x-request-id': 'client-request-123' },
    });

    assert.equal(response.headers.get('x-request-id'), 'client-request-123');
});

test('returns a safe JSON error for malformed JSON', async () => {
    const response = await request(createApp(), '/missing', {
        body: '{',
        headers: {
            'content-type': 'application/json',
            'x-request-id': 'invalid-json-request',
        },
        method: 'POST',
    });

    assert.equal(response.status, 400);
    assert.deepEqual(response.body, {
        code: 400,
        msg: 'Invalid request.',
        data: {
            requestId: 'invalid-json-request',
        },
    });
    assert.equal(JSON.stringify(response.body).includes('stack'), false);
});

test('rejects JSON bodies larger than the configured limit', async () => {
    const response = await request(createApp(), '/missing', {
        body: JSON.stringify({ value: 'x'.repeat(1024 * 1024) }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
    });

    assert.equal(response.status, 413);
    assert.equal((response.body as { msg: string }).msg, 'Request body is too large.');
});

test('accepts a valid chat request', async () => {
    const response = await request(createApp(), '/api/v1/chat/messages', {
        body: JSON.stringify({
            content: ' 你好 ',
        }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
    });

    assert.equal(response.status, 200);
    const body = response.body as {
        code: number;
        data: {
            conversationId: string;
            message: { content: string; createdAt: string; id: string; role: string };
        };
        msg: string;
    };
    const message = body.data.message;

    assert.equal(body.code, 200);
    assert.equal(body.msg, 'success');
    assert.match(body.data.conversationId, /^[0-9a-f-]{36}$/);
    assert.equal(message.role, 'assistant');
    assert.equal(message.content, 'Server 已收到：你好');
    assert.match(message.id, /^[0-9a-f-]{36}$/);
    assert.equal(Number.isNaN(Date.parse(message.createdAt)), false);
});

test('preserves a supplied conversation ID', async () => {
    const response = await request(createApp(), '/api/v1/chat/messages', {
        body: JSON.stringify({
            conversationId: ' conversation_123 ',
            content: 'hello',
        }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
    });

    assert.equal(response.status, 200);
    assert.equal(
        (
            response.body as {
                data: { conversationId: string };
            }
        ).data.conversationId,
        'conversation_123',
    );
});

test('rejects invalid chat request bodies', async () => {
    const invalidBodies = [
        {},
        { conversationId: 'conversation_123' },
        { conversationId: '   ', content: 'hello' },
        { conversationId: 'conversation_123', content: '   ' },
        { conversationId: 'x'.repeat(101), content: 'hello' },
        { conversationId: 'conversation_123', content: 'x'.repeat(2001) },
        { messages: [{ role: 'user', content: 'hello' }] },
        { conversationId: 'conversation_123', content: 'hello', role: 'user' },
    ];

    for (const body of invalidBodies) {
        const response = await request(createApp(), '/api/v1/chat/messages', {
            body: JSON.stringify(body),
            headers: {
                'content-type': 'application/json',
                'x-request-id': 'invalid-chat-request',
            },
            method: 'POST',
        });

        assert.equal(response.status, 400);
        assert.deepEqual(response.body, {
            code: 400,
            msg: 'Invalid request.',
            data: {
                requestId: 'invalid-chat-request',
            },
        });
    }
});

test('exposes planned model and conversation routes as explicit placeholders', async () => {
    const routes = [
        { method: 'GET', path: '/api/v1/models' },
        { method: 'GET', path: '/api/v1/conversations' },
        { method: 'GET', path: '/api/v1/conversations/conversation_123' },
        { method: 'GET', path: '/api/v1/conversations/conversation_123/messages' },
        { method: 'PATCH', path: '/api/v1/conversations/conversation_123' },
        { method: 'DELETE', path: '/api/v1/conversations/conversation_123' },
    ];

    for (const route of routes) {
        const response = await request(createApp(), route.path, { method: route.method });

        assert.equal(response.status, 501);
        assert.equal((response.body as { code: number }).code, 501);
        assert.equal((response.body as { msg: string }).msg, 'Not implemented.');
    }
});
