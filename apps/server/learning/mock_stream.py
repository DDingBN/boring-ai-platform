import asyncio


texts = ["你好，", "我是 Mock。"]


async def mock_parts():
    for text in texts:
        await asyncio.sleep(1)
        yield text


async def main():
    async for part in mock_parts():
        print("生成：", part)


if __name__ == "__main__":
    asyncio.run(main())
