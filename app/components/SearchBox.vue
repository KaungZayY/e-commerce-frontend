<template>
    <div class="flex flex-row ">
        <div class="flex items-center">
            <!-- <label for="select" class="mr-1">Columns: </label> -->
            <select name="select" id="select" v-model="selectedColumn"
                class="p-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                <option :value="null" selected>Select Column</option>
                <option v-for="col in columns" :key="col.field" :value="col">
                    {{ col.header }}
                </option>
            </select>

            <!-- Search Input -->
            <Spinner class="ml-2" v-show="loading" />
            <div v-show="!loading" class="flex items-center ml-2">
                <!-- <label for="search" class="mr-1">Search: </label> -->
                <input v-if="inputType === 'text'" type="text" v-model="searchQuery" class="p-1.5 border rounded w-56"
                    placeholder="Search..." />

                <div v-else-if="inputType === 'price_range'" class="flex gap-2">
                    <input type="number" v-model="price_range.start" class="p-1.5 border rounded w-24"
                        placeholder="Min" />
                    <input type="number" v-model="price_range.end" class="p-1.5 border rounded w-24"
                        placeholder="Max" />
                </div>
            </div>

            <!-- Submit Button -->
            <div class="ml-2 flex gap-2">
                <LoadingBtn label="Search" type="button" variant="primary" @click="handleSearch" />
                <LoadingBtn label="Clear" type="button" variant="neutral" @click="clearFilters" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

defineProps({
    columns: {
        type: Array,
        required: true,
    },
    search: String,
});

const loading = ref(false);

const selectedColumn = ref(null);
const searchQuery = ref('');
const price_range = ref({ start: '', end: '' });

const emit = defineEmits(['search']);

const inputType = computed(() => selectedColumn.value?.type || 'text');

const handleSearch = () => {
    emit('search', {
        column: selectedColumn.value?.field || '',
        search: inputType.value === 'price_range' ? price_range.value : searchQuery.value
    });
};

const clearFilters = () => {
    selectedColumn.value = null;
    searchQuery.value = '';
    price_range.value = { start: '', end: '' };
    emit('search', { column: '', search: '' });
};

watch(selectedColumn, (column) => {
    searchQuery.value = '';
    price_range.value = { start: '', end: '' };
});

</script>