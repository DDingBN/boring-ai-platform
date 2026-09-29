from collections.abc import AsyncIterator

from app.llm.base import StreamingChatProvider
from app.schemas.chat import ChatRequest


class StreamChatService:
    def __init__(self, provider: StreamingChatProvider) -> None:
        self._provider = provider

    async def stream_parts(self, request: ChatRequest) -> AsyncIterator[str]:
        contents = self._provider.stream(request.content)
        async for item in contents:
            yield item
