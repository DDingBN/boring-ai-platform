def make_reply(content):
    return "woc" + content

message = {"content": "nb"}
replies = [make_reply(message["content"])]
print(replies[0])