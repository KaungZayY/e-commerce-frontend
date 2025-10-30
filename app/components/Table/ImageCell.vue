<template>
    <img v-if="value" :src="image" alt="Logo" class="h-10 w-10 object-contain rounded" />
</template>

<script setup lang="ts">
const props = defineProps({
    value: { type: String, required: false, default: null }
})

const config = useRuntimeConfig()
const image = computed(() => {
    return `${config.public.apiBase}/file/${props.value}`
})
</script>
