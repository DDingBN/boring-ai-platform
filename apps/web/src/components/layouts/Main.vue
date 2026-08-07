<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    defaultMenuPath,
    getBreadcrumbItems,
    getMenuItemByPath,
    getMenuPathKeys,
} from '../../data/menuData.js';
import { getRouteMeta } from '../../data/routeMeta.js';
import LayoutContent from './Content.vue';
import LayoutFooter from './Footer.vue';
import LayoutHeader from './Header.vue';
import LayoutSider from './Sider.vue';

const route = useRoute();
const router = useRouter();
const collapsed = ref(false);
const menuState = ref(null);

const activeMenuItem = computed(() => getMenuItemByPath(route.path));
const activeRouteMeta = computed(() => getRouteMeta(route.path));
const activePath = computed(() => activeMenuItem.value?.path ?? defaultMenuPath);
const activeMenuKeys = computed(() => getMenuPathKeys(activePath.value));
const activeOpenMenuKeys = computed(() =>
    activeMenuItem.value ? activeMenuKeys.value.slice(0, -1) : [],
);
const breadcrumbItems = computed(() => {
    if (activeMenuItem.value) {
        return getBreadcrumbItems(activePath.value);
    }

    return activeRouteMeta.value?.breadcrumbItems ?? [{ title: '首页' }, { title: '页面不存在' }];
});
const openMenuKeys = computed(() =>
    menuState.value?.path === activePath.value ? menuState.value.keys : activeOpenMenuKeys.value,
);

function handleMenuSelect({ key }) {
    router.push(String(key));
}

function handleMenuOpenChange(keys) {
    menuState.value = { keys: keys.map(String), path: activePath.value };
}
</script>

<template>
    <a-layout class="app-layout">
        <LayoutSider
            :collapsed="collapsed"
            :open-keys="openMenuKeys"
            :selected-key="activeMenuItem ? activePath : undefined"
            @collapse="collapsed = $event"
            @menu-open-change="handleMenuOpenChange"
            @menu-select="handleMenuSelect"
        />
        <a-layout class="app-layout__body">
            <LayoutHeader
                :breadcrumb-items="breadcrumbItems"
                :collapsed="collapsed"
                @toggle-sider="collapsed = !collapsed"
            />
            <main class="app-layout__main">
                <LayoutContent>
                    <RouterView />
                </LayoutContent>
            </main>
            <LayoutFooter />
        </a-layout>
    </a-layout>
</template>
