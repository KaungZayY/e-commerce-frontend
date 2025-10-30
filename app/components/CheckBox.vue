<template>
    <div class="mb-2 space-y-1 py-2 w-full">
        <!-- Label -->
        <label :for="id" class="block text-sm py-1 text-gray-700">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <!-- Checkbox -->
        <input :id="id" type="checkbox" :checked="modelValue === 1" :disabled="disabled" @change="toggle"
            class="h-5 w-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none" />

        <!-- Error -->
        <p v-if="error" class="text-sm text-red-500">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: 0,
    },
    label: String,
    id: {
        type: String,
        required: true,
    },
    error: String,
    required: Boolean,
    disabled: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const toggle = (e) => {
    emit('update:modelValue', e.target.checked ? 1 : 0)
}
</script>
