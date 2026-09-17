import asyncio


async def fetch_reply():
    await asyncio.sleep(0.2)
    # raise ValueError("模拟获取失败")
    return "你好"


async def main():
    try:
        print("开始")
        result = await fetch_reply()
        print("得到结果：" + result)
    finally:
        print("清理")


asyncio.run(main())