from langchain_deepseek import ChatDeepSeek
from langchain_core.messages import HumanMessage
from pydantic import SecretStr

from app.core.errors import ProviderRequestError


class DeepSeekChatProvider:
    def __init__(self, *, api_key: str, model: str) -> None:
        self._model = ChatDeepSeek(
            api_key=SecretStr(api_key),
            model=model,
            max_retries=2,
            timeout=30,
        )

    async def complete(self, content: str) -> str:
        try:
            response = await self._model.ainvoke([HumanMessage(content=content)])
        except Exception as error:
            raise ProviderRequestError() from error

        if isinstance(response.content, str):
            return response.content

        text_parts = [
            str(part.get("text", ""))
            for part in response.content
            if isinstance(part, dict) and part.get("type") == "text"
        ]
        return "".join(text_parts)
