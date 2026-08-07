<script setup>
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
import LayoutBreadcrumb from './Breadcrumb.vue';

defineProps({
    breadcrumbItems: {
        type: Array,
        default: () => [],
    },
    collapsed: {
        type: Boolean,
        default: false,
    },
});

defineEmits(['toggle-sider']);
</script>

<template>
    <a-flex class="layout-header" align="center" justify="space-between">
        <a-space align="center" :size="16">
            <a-button
                :aria-label="collapsed ? '展开菜单栏' : '收起菜单栏'"
                type="text"
                @click="$emit('toggle-sider')"
            >
                <template #icon>
                    <MenuUnfoldOutlined v-if="collapsed" />
                    <MenuFoldOutlined v-else />
                </template>
            </a-button>
            <LayoutBreadcrumb :items="breadcrumbItems" />
        </a-space>
        <a-space align="center" :size="12">
            <a-typography-text class="layout-header__user-label" type="secondary">
                管理员
            </a-typography-text>
            <a-avatar>AI</a-avatar>
        </a-space>
    </a-flex>
</template>

<style scoped>
.layout-header {
    flex: 0 0 64px;
    height: 64px;
    min-width: 0;
    padding: 0 24px;
}

@media (max-width: 768px) {
    .layout-header {
        padding: 0 16px;
    }

    .layout-header__user-label {
        display: none;
    }
}
</style>
