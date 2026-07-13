import type { ChatMessage } from '@repo/shared';
import { Button, Card, Empty, Input, List, Space, Typography } from 'antd';
import { useState } from 'react';
import styles from './ChatPage.module.css';

const { TextArea } = Input;

const initialMessages: ChatMessage[] = [
    {
        id: 'welcome',
        role: 'assistant',
        content: '你好，我是 Boring Chat。你可以先把这里接成本地 mock，后续再替换成真实后端接口。',
        createdAt: new Date().toISOString(),
    },
];

function createMessage(role: ChatMessage['role'], content: string): ChatMessage {
    return {
        id: crypto.randomUUID(),
        role,
        content,
        createdAt: new Date().toISOString(),
    };
}

export function ChatPage() {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        const content = inputValue.trim();

        if (!content) {
            return;
        }

        const userMessage = createMessage('user', content);
        const assistantMessage = createMessage(
            'assistant',
            `已收到：${content}\n\n这里后续可以替换为 fetch('/api/chat') 或 SSE 流式响应。`,
        );

        setMessages((currentMessages) => [...currentMessages, userMessage, assistantMessage]);
        setInputValue('');
    };

    return (
        <div className={styles.page}>
            <Card className={styles.panel} title="Boring Chat">
                {messages.length === 0 ? (
                    <Empty description="暂无消息" />
                ) : (
                    <List
                        className={styles.messages}
                        dataSource={messages}
                        renderItem={(message) => (
                            <List.Item
                                className={`${styles.message} ${
                                    message.role === 'user' ? styles.userMessage : ''
                                }`}
                            >
                                <div className={styles.bubble}>
                                    <Typography.Text strong>
                                        {message.role === 'user' ? '你' : '助手'}
                                    </Typography.Text>
                                    <Typography.Paragraph className={styles.content}>
                                        {message.content}
                                    </Typography.Paragraph>
                                </div>
                            </List.Item>
                        )}
                    />
                )}
                <Space.Compact className={styles.composer}>
                    <TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        onChange={(event) => setInputValue(event.target.value)}
                        onPressEnter={(event) => {
                            if (!event.shiftKey) {
                                event.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="输入消息，Enter 发送，Shift + Enter 换行"
                        value={inputValue}
                    />
                    <Button type="primary" onClick={handleSend}>
                        发送
                    </Button>
                </Space.Compact>
            </Card>
        </div>
    );
}

export default ChatPage;
