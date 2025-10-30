<template>
    <nav class="text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol class="flex items-center flex-wrap">
            <li v-for="(item, index) in items" :key="index" class="flex items-center">
                <template v-if="item.href && index !== items.length - 1">
                    <NuxtLink :to="item.href" class="flex items-center gap-1 text-foreground hover:underline">
                        <component v-if="item.icon" :is="item.icon" class="w-4 h-4" />
                        {{ item.label }}
                    </NuxtLink>
                </template>
                <template v-else>
                    <span class="flex items-center gap-1 text-gray-500">
                        <component v-if="item.icon" :is="item.icon" class="w-4 h-4" />
                        {{ item.label }}
                    </span>
                </template>

                <!-- Separator -->
                <span v-if="index < items.length - 1" class="mx-2 text-gray-400">/</span>
            </li>
        </ol>
    </nav>
</template>


<script setup lang="ts">

defineProps<{
    items: {
        label: string
        href?: string
        icon?: Component
    }[]
}>()
</script>
