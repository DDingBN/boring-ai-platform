<script setup>
import { useRouter } from 'vue-router';
import { defaultMenuPath } from '../../data/menuData.js';

const router = useRouter();
</script>

<template>
    <a-result
        :class="$style.page"
        status="404"
        title="404"
        sub-title="页面不存在，或对应的页面组件尚未注册。"
    >
        <template #extra>
            <a-button type="primary" @click="router.push(defaultMenuPath)">返回首页</a-button>
        </template>
    </a-result>
</template>

<style module>
.page {
    min-height: calc(100vh - 154px);
    padding-top: 72px;
}
</style>
