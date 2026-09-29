import asyncio
from collections.abc import AsyncIterator

from app.llm.mock import MockChatProvider
from app.schemas.chat import ChatRequest
from app.services.stream_chat_service import StreamChatService


class FailingProvider:
    async def stream(self, content: str) -> AsyncIterator[str]:
        yield f"第一片：{content}"
        raise ValueError("模拟中途失败")


async def main():
    provider = MockChatProvider()
    service = StreamChatService(provider)
    request = ChatRequest(content="你好")
    parts = []

    async for part in service.stream_parts(request):
        print("服务片段：", part)
        parts.append(part)

    result = "".join(parts)
    print("拼接：", result)
    assert result == await provider.complete(request.content)

    failing_service = StreamChatService(FailingProvider())
    received = []
    caught_error = None

    try:
        async for part in failing_service.stream_parts(request):
            received.append(part)
            print("失败前片段：", part)
    except ValueError as error:
        caught_error = str(error)
        print("捕获异常：", caught_error)

    assert received == ["第一片：你好"]
    assert caught_error == "模拟中途失败"


if __name__ == "__main__":
    asyncio.run(main())
