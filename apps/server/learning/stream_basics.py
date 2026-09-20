def generate_parts():
    chunks = ["你好，", "我是", "Mock。"]

    for item in chunks:
        if item == "我是":
            raise ValueError("模拟第二段生成失败")
        yield item


parts = generate_parts()
print("已经创建生成器")

full_text = ""

for part in parts:
    full_text = full_text + part
    print("收到：", part)

print(full_text)
print("结束")