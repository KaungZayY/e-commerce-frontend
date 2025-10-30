<template>
    <div :class="[
        'mb-2 w-full',
        spacing ? 'space-y-1 py-2' : ''
    ]">
        <label :for="id" :class="[
            'block text-sm mb-1 text-gray-700',
            disabled ? 'text-gray-400' : '',
            labelClass
        ]">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <textarea :id="id" :placeholder="placeholder" :value="modelValue" :disabled="disabled" :rows="rows" :class="[
            'w-full border rounded-md px-3 py-1.5 resize-none focus:outline-none transition-colors duration-200',
            disabled
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-gray-500 text-gray-700 focus:ring-2 focus:ring-gray-500 bg-white cursor-text',
            error && !disabled ? 'border-red-500 focus-visible:ring-red-500' : '',
            inputClass
        ]" @input="$emit('update:modelValue', $event.target.value)"></textarea>

        <p v-if="error" class="text-sm text-red-500">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    id: string
    inputClass?: string
    labelClass?: string
    error?: string
    required?: boolean
    disabled?: boolean
    rows?: number
    spacing?: boolean
}>(), {
    rows: 4,
    spacing: true,
})

defineEmits(['update:modelValue'])
</script>
