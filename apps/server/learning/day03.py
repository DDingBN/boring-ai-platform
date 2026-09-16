from text_helpers import make_reply

contents = ["你好", " ", "我在学习Python"]

for content in contents:
    try:
        reply = make_reply(content)
        print(reply)
    except ValueError as error:
        print("处理失败：" + str(error))