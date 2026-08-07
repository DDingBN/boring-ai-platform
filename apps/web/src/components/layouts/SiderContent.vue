<script setup>
import LayoutMenu from './menu/Menu.vue';

defineProps({
    collapsed: {
        type: Boolean,
        default: false,
    },
    openKeys: {
        type: Array,
        default: () => [],
    },
    selectedKey: {
        type: String,
        default: undefined,
    },
});

defineEmits(['menu-open-change', 'menu-select']);
</script>

<template>
    <div :class="['layout-sider__brand', collapsed ? 'layout-sider__brand--collapsed' : undefined]">
        <a-avatar :size="32" shape="square">BA</a-avatar>
        <a-typography-text v-if="!collapsed" class="layout-sider__title" strong>
            Boring AI
        </a-typography-text>
    </div>
    <LayoutMenu
        :open-keys="openKeys"
        :selected-key="selectedKey"
        @open-change="$emit('menu-open-change', $event)"
        @select="$emit('menu-select', $event)"
    />
</template>

<style scoped>
.layout-sider__brand {
    align-items: center;
    display: flex;
    gap: 10px;
    height: 64px;
    padding: 0 20px;
}

.layout-sider__title {
    white-space: nowrap;
}

.layout-sider__brand--collapsed {
    justify-content: center;
    padding: 0;
}
</style>
