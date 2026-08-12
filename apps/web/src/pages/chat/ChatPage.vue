<script setup>
import { ref } from 'vue';
import { axiosPost } from '../../utils/request.js';

const initialMessages = [
    {
        id: 'welcome',
        role: 'assistant',
        content: '你好，我是 Boring Chat。有什么可以帮助你？',
        createdAt: new Date().toISOString(),
    },
];

const messages = ref([...initialMessages]);
const inputValue = ref('');

function createMessage(role, content) {
    return {
        id: crypto.randomUUID(),
        role,
        content,
        createdAt: new Date().toISOString(),
    };
}

function handleSend() {
    const content = inputValue.value.trim();

    if (!content) {
        return;
    }

    axiosPost('/v1/chat/messages', {
        content: content,
    }).then((res) => {
        console.log(res);
    });

    messages.value.push(createMessage('user', content));
    inputValue.value = '';
}

function handlePressEnter(event) {
    if (!event.shiftKey) {
        event.preventDefault();
        handleSend();
    }
}
</script>

<template>
    <div :class="$style.page">
        <a-card :class="$style.panel" title="Boring Chat">
            <a-empty v-if="messages.length === 0" description="暂无消息" />
            <a-list v-else :class="$style.messages" :data-source="messages">
                <template #renderItem="{ item }">
                    <a-list-item :class="item.role === 'user' ? $style.userMessage : undefined">
                        <a-card :class="$style.bubble" size="small">
                            <a-typography-text strong>
                                {{ item.role === 'user' ? '你' : '助手' }}
                            </a-typography-text>
                            <a-typography-paragraph :class="$style.content">
                                {{ item.content }}
                            </a-typography-paragraph>
                        </a-card>
                    </a-list-item>
                </template>
            </a-list>
            <a-space-compact :class="$style.composer">
                <a-textarea
                    v-model:value="inputValue"
                    :auto-size="{ minRows: 2, maxRows: 6 }"
                    placeholder="输入消息，按 Enter 发送，按 Shift + Enter 换行"
                    @press-enter="handlePressEnter"
                />
                <a-button type="primary" @click="handleSend">发送</a-button>
            </a-space-compact>
        </a-card>
    </div>
</template>

<style module>
.page {
    display: flex;
    flex: 1;
    height: 100%;
    min-height: 0;
    min-width: 0;
    width: 100%;
}

.panel {
    display: flex;
    flex: 1;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
    width: 100%;
}

.panel :global(.ant-card-head) {
    flex: 0 0 auto;
}

.panel :global(.ant-card-body) {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    overflow: hidden;
}

.messages {
    flex: 1;
    margin-bottom: 16px;
    min-height: 0;
    min-width: 0;
    overflow: auto;
}

.userMessage {
    justify-content: flex-end;
}

.bubble {
    max-width: min(720px, 84%);
}

.content {
    margin: 6px 0 0 !important;
    white-space: pre-wrap;
}

.composer {
    display: flex;
    flex: 0 0 auto;
    min-width: 0;
    width: 100%;
}

.composer :global(.ant-btn) {
    height: 100%;
}
</style>
