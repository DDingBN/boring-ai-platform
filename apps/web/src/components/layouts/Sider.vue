<script setup>
import { Grid } from 'ant-design-vue';
import { computed, watch } from 'vue';
import SiderContent from './SiderContent.vue';

const props = defineProps({
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

const emit = defineEmits(['collapse', 'menu-open-change', 'menu-select']);
const screens = Grid.useBreakpoint();
const isMobile = computed(() => screens.value.lg === false);

watch(isMobile, (mobile) => {
    if (mobile) {
        emit('collapse', true);
    }
});

function handleMenuSelect(info) {
    emit('menu-select', info);

    if (isMobile.value) {
        emit('collapse', true);
    }
}
</script>

<template>
    <a-layout-sider
        v-if="!isMobile"
        breakpoint="lg"
        :collapsed="props.collapsed"
        :collapsed-width="72"
        theme="light"
        :width="248"
        @collapse="$emit('collapse', $event)"
    >
        <SiderContent
            :collapsed="props.collapsed"
            :open-keys="props.openKeys"
            :selected-key="props.selectedKey"
            @menu-open-change="$emit('menu-open-change', $event)"
            @menu-select="handleMenuSelect"
        />
    </a-layout-sider>
    <a-drawer
        v-else
        class="layout-sider-drawer"
        :closable="false"
        :open="!props.collapsed"
        placement="left"
        :width="248"
        @close="$emit('collapse', true)"
    >
        <SiderContent
            :open-keys="props.openKeys"
            :selected-key="props.selectedKey"
            @menu-open-change="$emit('menu-open-change', $event)"
            @menu-select="handleMenuSelect"
        />
    </a-drawer>
</template>

<style>
.layout-sider-drawer .ant-drawer-body {
    padding: 0;
}
</style>
