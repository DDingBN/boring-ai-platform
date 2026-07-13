# Boring AI Platform

A monorepo-based AI workflow and agent platform.

## Requirements

- Node.js `22.12.0`
- pnpm `10.25.0`

## Local development

```bash
cp .env.example .env
pnpm install
pnpm dev
```

The included environment example is intentionally key-free: the current project can start without an API key. Both the API and web development servers bind to `127.0.0.1` by default. Configuration is validated at startup; see `.env.example` for the supported local settings.

For a local DeepSeek test, add `DEEPSEEK_API_KEY=...` only to your untracked root `.env`. It is loaded by the server process and must never use a `VITE_` prefix, which would expose it to browser code. `AI_PROVIDER` is centrally validated, and `DATABASE_URL` is optional until database access is added; when set, it is validated without ever being included in an error message. Leave secrets and connection strings empty in `.env.example`.

## Apps

- web: frontend application
- server: backend api service

## Packages

- shared: shared types and utilities
- ai: llm, embedding, tool and rag logic
- database: prisma schema and database client

## Tech Stack

- pnpm workspace
- turborepo
- react + vite
- express + typescript
- prisma
