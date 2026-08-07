<script setup>
import { useRouter } from 'vue-router';
import { defaultMenuPath } from '../../data/menuData.js';

const router = useRouter();
</script>

<template>
    <a-result
        :class="$style.page"
        status="500"
        title="500"
        sub-title="服务器发生错误，请稍后再试。"
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
