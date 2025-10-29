<template>
    <button :disabled="loading" @click="emit('click')"
        class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-70 flex items-center justify-center gap-2 w-full">
        <!-- spinner or icon -->
        <i v-if="icon && !loading" :class="['pi', `pi-${icon}`, 'text-white']"></i>

        <span class="flex-1 text-center">
            {{ loading ? loadingLabel : label }}
        </span>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    label: string
    loadingLabel: string
    loading?: boolean
    icon?: string // e.g., "check", "plus", "times"
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()
</script>
