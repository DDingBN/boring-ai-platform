<script setup>
import { computed } from 'vue';
import { menuData } from '../../../data/menuData.js';
import { createLayoutMenuItems } from './menuItems.js';

const props = defineProps({
    hasPermission: {
        type: Function,
        default: undefined,
    },
    items: {
        type: Array,
        default: undefined,
    },
    mode: {
        type: String,
        default: 'inline',
    },
    openKeys: {
        type: Array,
        default: () => [],
    },
    selectedKey: {
        type: String,
        default: undefined,
    },
    theme: {
        type: String,
        default: 'light',
    },
});

defineEmits(['open-change', 'select']);

const menuItems = computed(
    () => props.items ?? createLayoutMenuItems(menuData, { hasPermission: props.hasPermission }),
);
</script>

<template>
    <a-menu
        :items="menuItems"
        :mode="mode"
        :open-keys="mode === 'inline' ? openKeys : undefined"
        :selected-keys="selectedKey ? [selectedKey] : []"
        :theme="theme"
        @open-change="$emit('open-change', $event)"
        @select="$emit('select', $event)"
    />
</template>
