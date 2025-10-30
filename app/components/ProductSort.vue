<template>
    <div class="flex items-center gap-2">
        <label for="sort" class="text-sm font-medium text-gray-700">Sort by:</label>
        <select id="sort" v-model="selected" @change="emitSort"
            class="border border-gray-300 rounded px-2 py-1 text-sm">
            <option value="">Default</option>
            <option value="created_at_desc">Latest</option>
            <option value="is_popular">Popularity</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
        </select>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue', 'sort-change'])

const selected = ref(props.modelValue)

watch(() => props.modelValue, (val) => selected.value = val)

const emitSort = () => {
    emit('update:modelValue', selected.value)
    emit('sort-change', selected.value)
}
</script>
