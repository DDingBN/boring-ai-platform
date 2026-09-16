class Echo:
    def __init__(self, prefix: str) -> None:
        self.prefix = prefix

    def reply(self, content: str) -> str:
        return self.prefix + content


echo = Echo("客服：")
echo1 = Echo("助手：")
print(echo.reply("你好"))
print(echo1.reply("你好"))
print(echo.reply("再见"))