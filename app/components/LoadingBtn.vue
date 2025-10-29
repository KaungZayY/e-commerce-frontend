<template>
    <button :disabled="loading" @click="emit('click')" :class="[
        'text-white py-2 px-4 rounded-md disabled:opacity-70 flex items-center justify-center gap-2 w-full transition-colors duration-200',
        variantClass
    ]">
        <!-- Icon (if not loading) -->
        <i v-if="icon && !loading" :class="['pi', `pi-${icon}`, 'text-white']"></i>

        <!-- Label -->
        <span class="flex-1 text-center">
            {{ loading ? loadingLabel : label }}
        </span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    label: string
    loadingLabel: string
    loading?: boolean
    icon?: string
    variant?: 'primary' | 'danger' // semantic style
}>()

const emit = defineEmits<{
    (e: 'click'): void
}>()

// Computed class for variant
const variantClass = computed(() => {
    switch (props.variant) {
        case 'danger':
            return 'bg-red-600 hover:bg-red-700'
        default:
            return 'bg-blue-600 hover:bg-blue-700'
    }
})
</script>
