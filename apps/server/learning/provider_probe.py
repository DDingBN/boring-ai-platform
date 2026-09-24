import asyncio

from app.llm.mock import MockChatProvider


async def main():
    provider = MockChatProvider()
    parts = []

    async for part in provider.stream("你好"):
        print("片段：", part)
        parts.append(part)

    print("拼接：", "".join(parts))
    print("原接口：", await provider.complete("你好"))


if __name__ == "__main__":
    asyncio.run(main())
