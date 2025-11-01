<template>
    <div class="w-4/5">
        <h3 class="font-semibold text-gray-800 mb-3 text-sm">FILTER BY PRICE</h3>

        <!-- Dual Range Slider -->
        <div class="px-2 mb-4">
            <div class="relative h-1.5 bg-gray-200 rounded-full">
                <!-- Active range track -->
                <div class="absolute h-1.5 bg-blue-600 rounded-full" :style="{
                    left: minPercent + '%',
                    right: (100 - maxPercent) + '%'
                }"></div>

                <!-- Min thumb (lower z-index) -->
                <input type="range" :min="absoluteMin" :max="absoluteMax" v-model.number="minValue" @input="onMinChange"
                    class="range-slider range-slider-min" />

                <!-- Max thumb (higher z-index) -->
                <input type="range" :min="absoluteMin" :max="absoluteMax" v-model.number="maxValue" @input="onMaxChange"
                    class="range-slider range-slider-max" />
            </div>
        </div>

        <!-- Price Display -->
        <div class="flex items-center justify-between mb-4">
            <div class="text-xs text-gray-700">
                Price: <span class="font-semibold">RM{{ minValue }}</span> — <span class="font-semibold">RM{{ maxValue
                }}</span>
            </div>
            <button @click="applyFilter"
                class="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors">
                FILTER
            </button>
        </div>

        <!-- Stock Status -->
        <div class="mt-6">
            <h3 class="font-semibold text-gray-800 mb-3 text-sm">STOCK STATUS</h3>

            <div class="space-y-2">
                <label class="flex items-center cursor-pointer group">
                    <input type="checkbox" v-model="stockFilters.onSale" @change="applyStockFilter"
                        class="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">On sale</span>
                </label>

                <label class="flex items-center cursor-pointer group">
                    <input type="checkbox" v-model="stockFilters.inStock" @change="applyStockFilter"
                        class="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">In stock</span>
                </label>

                <label class="flex items-center cursor-pointer group">
                    <input type="checkbox" v-model="stockFilters.onBackorder" @change="applyStockFilter"
                        class="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                    <span class="ml-2 text-sm text-gray-700 group-hover:text-blue-600 transition-colors">On
                        backorder</span>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    min: {
        type: Number,
        default: 0
    },
    max: {
        type: Number,
        default: 260
    }
})

const emit = defineEmits(['filter'])

const absoluteMin = ref(props.min)
const absoluteMax = ref(props.max)
const minValue = ref(props.min)
const maxValue = ref(props.max)

const stockFilters = ref({
    onSale: false,
    inStock: false,
    onBackorder: false
})

// Calculate percentages for styling
const minPercent = computed(() => {
    return ((minValue.value - absoluteMin.value) / (absoluteMax.value - absoluteMin.value)) * 100
})

const maxPercent = computed(() => {
    return ((maxValue.value - absoluteMin.value) / (absoluteMax.value - absoluteMin.value)) * 100
})

// Ensure min doesn't exceed max
const onMinChange = () => {
    const gap = 10
    if (minValue.value > maxValue.value - gap) {
        minValue.value = maxValue.value - gap
    }
}

// Ensure max doesn't go below min
const onMaxChange = () => {
    const gap = 10
    if (maxValue.value < minValue.value + gap) {
        maxValue.value = minValue.value + gap
    }
}

const applyFilter = () => {
    emit('filter', {
        priceRange: {
            start: minValue.value,
            end: maxValue.value
        },
        stock: stockFilters.value
    })
}

const applyStockFilter = () => {
    emit('filter', {
        priceRange: {
            start: minValue.value,
            end: maxValue.value
        },
        stock: stockFilters.value
    })
}

// Watch for prop changes
watch(() => [props.min, props.max], ([newMin, newMax]) => {
    absoluteMin.value = newMin
    absoluteMax.value = newMax
    minValue.value = newMin
    maxValue.value = newMax
})
</script>

<style scoped>
/* Custom range input styling */
.range-slider {
    position: absolute;
    width: 100%;
    height: 1.5px;
    top: 0;
    background: transparent;
    appearance: none;
    -webkit-appearance: none;
    pointer-events: none;
}

.range-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #2563eb;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    pointer-events: all;
    position: relative;
}

.range-slider::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #2563eb;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    pointer-events: all;
}

.range-slider::-webkit-slider-thumb:hover {
    background: #1d4ed8;
}

.range-slider::-moz-range-thumb:hover {
    background: #1d4ed8;
}

/* Z-index for proper layering */
.range-slider-min {
    z-index: 3;
}

.range-slider-max {
    z-index: 4;
}

/* When min value is greater than 50%, swap z-index */
.range-slider-min::-webkit-slider-thumb {
    z-index: 5;
}
</style>