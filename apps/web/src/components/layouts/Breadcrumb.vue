<script setup>
defineProps({
    items: {
        type: Array,
        default: () => [],
    },
});
</script>

<template>
    <a-breadcrumb>
        <a-breadcrumb-item v-for="item in items" :key="item.title">
            {{ item.title }}
        </a-breadcrumb-item>
    </a-breadcrumb>
</template>
