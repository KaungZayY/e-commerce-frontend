<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <!-- Title -->
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            {{ title }}
        </h1>

        <!-- Last Updated -->
        <p class="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
            <span class="font-medium">Last Updated:</span>
            {{ formattedDate }}
        </p>

        <!-- Description (supports HTML like <strong>, <span>, etc.) -->
        <p class="text-sm sm:text-base text-gray-700 leading-relaxed" v-html="description"></p>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: {
        type: String,
        required: true
    },
    time: {
        type: [String, Date],
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

// ✅ Format date to "02 August 2025"
const formattedDate = computed(() => {
    const date = new Date(props.time)
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    })
})
</script>
