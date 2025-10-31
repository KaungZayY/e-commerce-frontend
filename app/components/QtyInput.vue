<template>
    <div class="mb-2 py-2 w-full">
        <!-- Horizontal Layout: Label + Input -->
        <div class="flex items-start gap-2">
            <!-- Label -->
            <label :for="id" class="text-sm text-gray-700 pt-2 whitespace-nowrap w-24">
                {{ label }}
                <span v-if="required" class="text-red-500 ml-1">*</span>
            </label>

            <!-- Input Container -->
            <div class="flex-1">
                <!-- With Unit -->
                <div v-if="unit" class="flex rounded-md border transition-colors duration-200" :class="[
                    error ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-500 focus-within:ring-2 focus-within:ring-gray-500',
                    disabled ? 'opacity-70 cursor-not-allowed bg-gray-100' : ''
                ]">
                    <!-- Input -->
                    <input :id="id" type="text" inputmode="numeric" :placeholder="placeholder" :value="modelValue"
                        :disabled="disabled"
                        class="w-full rounded-l-md px-3 py-1.5 focus:outline-none transition-colors duration-200"
                        :class="[
                            disabled
                                ? 'bg-gray-100 text-gray-400 placeholder-gray-300'
                                : 'bg-white text-gray-700 placeholder-gray-400',
                            inputClass
                        ]" @input="handleInput" @keydown="handleKeydown" />

                    <!-- Unit display -->
                    <div class="w-16 flex items-center justify-center rounded-r-md border-l text-sm transition-colors duration-200"
                        :class="[
                            disabled
                                ? 'border-gray-300 bg-gray-200 text-gray-400'
                                : 'border-gray-500 bg-gray-100 text-gray-600'
                        ]">
                        {{ unit }}
                    </div>
                </div>

                <!-- Normal input (no unit) -->
                <input v-else :id="id" type="text" inputmode="numeric" :placeholder="placeholder" :value="modelValue"
                    :disabled="disabled" :class="[
                        'w-full border rounded-md px-3 py-1.5 focus:outline-none transition-colors duration-200',
                        error
                            ? 'border-red-500 focus-visible:ring-red-500'
                            : 'border-gray-500 focus:ring-2 focus:ring-gray-500',
                        disabled
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
                            : '',
                        inputClass
                    ]" @input="handleInput" @keydown="handleKeydown" />

                <!-- Error message below input -->
                <p v-if="error" class="text-sm text-red-500 mt-1">
                    {{ error }}
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string | number | undefined | null
    label?: string
    placeholder?: string
    id: string
    inputClass?: string
    error?: string
    required?: boolean
    disabled?: boolean
    unit?: string | null
}>()

const emit = defineEmits(['update:modelValue'])

// Handle input - only allow integers
const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    let value = target.value

    // Remove any non-digit characters
    value = value.replace(/[^0-9]/g, '')

    // Update the input value
    target.value = value

    // Emit the cleaned value (as number if not empty, otherwise empty string)
    emit('update:modelValue', value === '' ? '' : parseInt(value, 10))
}

// Prevent typing non-numeric characters
const handleKeydown = (event: KeyboardEvent) => {
    // Allow: backspace, delete, tab, escape, enter, arrow keys
    const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
    ]

    // Allow Ctrl/Cmd + A, C, V, X (select all, copy, paste, cut)
    if ((event.ctrlKey || event.metaKey) && ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
        return
    }

    // If key is in allowed list, allow it
    if (allowedKeys.includes(event.key)) {
        return
    }

    // If key is not a number, prevent it
    if (!/^[0-9]$/.test(event.key)) {
        event.preventDefault()
    }
}
</script>