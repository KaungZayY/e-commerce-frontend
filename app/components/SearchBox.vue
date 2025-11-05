<template>
    <div class="w-full">
        <!-- ✅ Responsive Filter Toolbar -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-start gap-3 sm:gap-4 w-full">
            <!-- 🔹 Column Selector -->
            <div class="flex items-center w-full sm:w-auto">
                <select name="select" id="select" v-model="selectedColumn"
                    class="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                    <option :value="null" selected>Select Column</option>
                    <option v-for="col in columns" :key="col.field" :value="col">
                        {{ col.header }}
                    </option>
                </select>
            </div>

            <!-- 🔹 Search Input -->
            <div class="flex items-center w-full sm:w-auto">
                <Spinner class="ml-2" v-show="loading" />
                <div v-show="!loading" class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto ml-0 sm:ml-2">
                    <!-- Text Input -->
                    <input v-if="inputType === 'text'" type="text" v-model="searchQuery"
                        class="w-full sm:w-56 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Search..." />

                    <!-- Price Range -->
                    <div v-else-if="inputType === 'price_range'" class="flex flex-row gap-2 w-full sm:w-auto">
                        <input type="number" v-model="price_range.start"
                            class="w-full sm:w-24 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Min" />
                        <input type="number" v-model="price_range.end"
                            class="w-full sm:w-24 px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Max" />
                    </div>
                </div>
            </div>

            <!-- 🔹 Action Buttons -->
            <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <LoadingBtn label="Search" type="button" variant="primary" class="w-full sm:w-auto"
                    @click="handleSearch" />
                <LoadingBtn label="Clear" type="button" variant="neutral" class="w-full sm:w-auto"
                    @click="clearFilters" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps({
    columns: {
        type: Array,
        required: true,
    },
    search: String,
})

const emit = defineEmits(['search'])

const loading = ref(false)
const selectedColumn = ref(null)
const searchQuery = ref('')
const price_range = ref({ start: '', end: '' })

const inputType = computed(() => selectedColumn.value?.type || 'text')

const handleSearch = () => {
    emit('search', {
        column: selectedColumn.value?.field || '',
        search:
            inputType.value === 'price_range'
                ? price_range.value
                : searchQuery.value,
    })
}

const clearFilters = () => {
    selectedColumn.value = null
    searchQuery.value = ''
    price_range.value = { start: '', end: '' }
    emit('search', { column: '', search: '' })
}

watch(selectedColumn, () => {
    searchQuery.value = ''
    price_range.value = { start: '', end: '' }
})
</script>
