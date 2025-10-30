<template>
    <div class="mb-2 space-y-1 py-2 w-full">
        <label :for="id" class="block text-sm py-1 text-gray-700">
            {{ label }}
            <span v-if="required" class="text-red-500 ml-1">*</span>
        </label>

        <div v-if="unit" class="flex rounded-md border transition-colors duration-200" :class="[
            error ? 'border-red-500 focus-within:ring-red-500' : 'border-gray-500 focus-within:ring-2 focus-within:ring-gray-500',
            disabled ? 'opacity-70 cursor-not-allowed bg-gray-100' : ''
        ]">
            <!-- Input -->
            <input :id="id" :type="type || 'text'" :placeholder="placeholder" :value="modelValue" :disabled="disabled"
                class="w-full rounded-l-md px-3 py-1.5 focus:outline-none transition-colors duration-200" :class="[
                    disabled
                        ? 'bg-gray-100 text-gray-400 placeholder-gray-300'
                        : 'bg-white text-gray-700 placeholder-gray-400',
                    inputClass
                ]" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />

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
        <input v-else :id="id" :type="type || 'text'" :placeholder="placeholder" :value="modelValue"
            :disabled="disabled" :class="[
                'w-full border rounded-md px-3 py-1.5 focus:outline-none transition-colors duration-200',
                error
                    ? 'border-red-500 focus-visible:ring-red-500'
                    : 'border-gray-500 focus:ring-2 focus:ring-gray-500',
                disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-70'
                    : '',
                inputClass
            ]" @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />

        <p v-if="error" class="text-sm text-red-500 mt-1">
            {{ error }}
        </p>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    modelValue: string | number | undefined | null
    label?: string
    type?: string
    placeholder?: string
    id: string
    inputClass?: string
    error?: string
    required?: boolean
    disabled?: boolean
    padding?: boolean
    unit?: string | null
}>()

defineEmits(['update:modelValue'])
</script>
