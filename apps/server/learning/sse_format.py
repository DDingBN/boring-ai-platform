import json


def make_delta(text):
    payload = {"text": text}
    data_text = json.dumps(payload, ensure_ascii=False)

    event_text = "event: delta\n" + "data: " + data_text + "\n\n"

    return event_text


contents = ["你好", "我是Mock"]
print_text = ""

for content in contents:
    print_text = make_delta(content)
    print(print_text, end="")

print(repr(print_text))