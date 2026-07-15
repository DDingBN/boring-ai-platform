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
    assert.deepEqual(response.body, { ok: true });
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
        error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request.',
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
    assert.equal(
        (response.body as { error: { message: string } }).error.message,
        'Request body is too large.',
    );
});
