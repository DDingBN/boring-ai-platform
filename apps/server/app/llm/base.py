from typing import Protocol


class ChatProvider(Protocol):
    async def complete(self, content: str) -> str:
        """Return one assistant response for the supplied user content."""
