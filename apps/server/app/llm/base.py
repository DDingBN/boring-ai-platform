from collections.abc import AsyncIterator
from typing import Protocol


class StreamingChatProvider(Protocol):
    def stream(self, content: str) -> AsyncIterator[str]:
        ...


class ChatProvider(Protocol):
    async def complete(self, content: str) -> str:
        """Return one assistant response for the supplied user content."""
