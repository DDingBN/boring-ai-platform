<script setup>
import { useRouter } from 'vue-router';
import { defaultMenuPath } from '../../data/menuData.js';

const router = useRouter();
</script>

<template>
    <a-result
        :class="$style.page"
        status="403"
        title="403"
        sub-title="你暂时没有权限访问这个页面。"
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
