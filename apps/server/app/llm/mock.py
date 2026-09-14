class MockChatProvider:
    async def complete(self, content: str) -> str:
        return f"Python 服务端已收到：{content}"
