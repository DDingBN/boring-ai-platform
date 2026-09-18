def make_reply(content):
    return "收到：" + content


def test_make_reply():
    assert make_reply("你好") == "收到：你好"


def test_new_reply():
    assert make_reply("今天学习测试") == "收到：今天学习测试"