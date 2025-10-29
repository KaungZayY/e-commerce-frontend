<template>
    <div class="flex justify-center w-full">
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            :class="['animate-spin', props.class]">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    class?: string
}>()
</script>
