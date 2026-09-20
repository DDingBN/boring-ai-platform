import asyncio


async def generate_parts():
    chunks = ["你好，", "我是", "Mock。"]
    for chunk in chunks:
        await asyncio.sleep(0.2)
        if chunk == "我是":
            raise ValueError("模拟第二段生成失败")
        yield chunk


async def main():
    full_text = ""
    parts = generate_parts()
    print("开始接收")

    async for part in parts:
        full_text = full_text + part
        print("收到：", part)

    print("完整回复：" + full_text)
    print("结束")


asyncio.run(main())