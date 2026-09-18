import asyncio

from app.schemas.chat import ChatRequest
from app.services.chat_service import ChatService

class FixedChatProvider:
    async def complete(self, content: str) -> str:
        return "这是 D08 的固定回复"

async def main():
    provider = FixedChatProvider()
    service = ChatService(provider)

    request = ChatRequest(
        content="你好，D08",
        conversationId="demo_08",
    )

    result = await service.send_message(request)

    print("用户输入：", request.content)
    print("助手回复：", result.message.content)
    print("会话 ID：", result.conversation_id)
    print("消息角色：", result.message.role)


asyncio.run(main())