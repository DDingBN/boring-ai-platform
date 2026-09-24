from collections.abc import AsyncIterator


class MockChatProvider:
    async def complete(self, content: str) -> str:
        return f"Python 服务端已收到：{content}"

    async def stream(self, content: str) -> AsyncIterator[str]:
        yield "Python 服务端已收到："
        yield content
