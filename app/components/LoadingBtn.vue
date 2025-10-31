<template>
    <button :disabled="loading || disabled" @click="!loading && !disabled && emit('click')" :class="[
        'flex items-center justify-center gap-2 rounded-md transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed',
        sizeClass,
        variantClass,
        label ? 'w-full px-4 py-2 text-white' : 'p-2' // compact style if no label
    ]">
        <!-- Icon (if available and not loading) -->
        <i v-if="icon && !loading" :class="['pi', `pi-${icon}`, 'text-white']"></i>

        <!-- Label (if present) -->
        <span v-if="label" class="flex-1 text-center">
            {{ loading ? loadingLabel : label }}
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    label?: string
    loadingLabel?: string
    loading?: boolean
    disabled?: boolean
    icon?: string
    variant?: 'primary' | 'danger' | 'neutral'
    size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

// Computed class for color variant
const variantClass = computed(() => {
    switch (props.variant) {
        case 'danger':
            return 'bg-red-600 hover:bg-red-700 text-white'
        case 'neutral':
            return 'bg-gray-500 hover:bg-gray-600 text-white'
        default:
            return 'bg-blue-600 hover:bg-blue-700 text-white'
    }
})

// Computed class for size
const sizeClass = computed(() => {
    switch (props.size) {
        case 'sm':
            return 'text-sm'
        case 'lg':
            return 'text-lg'
        default:
            return 'text-base'
    }
})
</script>
