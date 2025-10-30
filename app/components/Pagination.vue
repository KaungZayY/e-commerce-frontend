<template>
    <div class="flex items-center justify-center space-x-2">
        <button :disabled="currentPage === 1" @click="$emit('change-page', currentPage - 1)"
            class="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Prev
        </button>

        <button v-for="page in pagesToShow" :key="page" @click="$emit('change-page', page)" :class="[
            'px-3 py-1 rounded border hover:bg-gray-100',
            page === currentPage ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700'
        ]">
            {{ page }}
        </button>

        <button :disabled="currentPage === totalPages" @click="$emit('change-page', currentPage + 1)"
            class="px-3 py-1 rounded border bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    currentPage: { type: Number, required: true },
    totalPages: { type: Number, required: true },
})

const emit = defineEmits(['change-page'])

// Simple pagination logic: show max 5 pages
const pagesToShow = computed(() => {
    const pages = []
    let start = Math.max(1, props.currentPage - 2)
    let end = Math.min(props.totalPages, props.currentPage + 2)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})
</script>
