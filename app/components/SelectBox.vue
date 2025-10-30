<template>
    <div class="mb-2 space-y-1 py-2 w-full">
        <label :for="id" class="block text-sm py-1 text-gray-700" :class="{ 'text-gray-400': disabled }">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <select :id="id" :value="modelValue" @change="handleChange" :disabled="disabled" :class="[
            'w-full border text-gray-700 rounded-md px-3 py-2 focus:outline-none transition-colors duration-200',
            disabled
                ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                : 'border-gray-500 focus:ring-2 focus:ring-gray-500 bg-white cursor-pointer',
            error && !disabled ? 'border-red-500 focus-visible:ring-red-500' : '',
            inputClass
        ]">
            <option value="" disabled selected>{{ placeholder }}</option>

            <option v-for="option in dataOptions" :key="option[optionValue]" :value="option[optionValue]">
                {{ capitalize
                    ? option[optionLabel].charAt(0).toUpperCase() + option[optionLabel].slice(1)
                    : option[optionLabel]
                }}
            </option>
        </select>

        <small v-if="error" class="text-red-500">{{ error }}</small>
    </div>
</template>

<script setup>
const props = defineProps({
    modelValue: [String, Number, null],
    label: String,
    placeholder: {
        type: String,
        default: 'Select an option'
    },
    dataOptions: {
        type: Array,
        required: true
    },
    optionLabel: {
        type: String,
        default: 'label'
    },
    optionValue: {
        type: String,
        default: 'value'
    },
    id: { type: String, required: true },
    inputClass: String,
    error: String,
    required: { type: Boolean, default: false },
    capitalize: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

function handleChange(event) {
    emit('update:modelValue', event.target.value)
}
</script>
