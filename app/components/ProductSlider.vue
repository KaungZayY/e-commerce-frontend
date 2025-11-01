<template>
    <div class="relative">
        <!-- Products Container -->
        <div class="overflow-hidden">
            <div class="flex transition-transform duration-500 ease-in-out"
                :style="{ transform: `translateX(-${currentSlide * slidePercentage}%)` }">
                <!-- Render all products in a row -->
                <div v-for="product in products" :key="product.id" class="flex-shrink-0 px-2" style="width: 20%">
                    <ProductCard :product="product" />
                </div>
            </div>
        </div>

        <!-- Left Arrow (only show if more than 5 products) -->
        <button v-if="products.length > 5 && currentSlide > 0" @click="prevSlide"
            class="absolute -left-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <!-- Right Arrow (only show if more than 5 products) -->
        <button v-if="products.length > 5 && currentSlide < maxSlide" @click="nextSlide"
            class="absolute -right-6 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
            </svg>
        </button>

        <!-- Navigation dots (only show if more than 5 products) -->
        <div v-if="products.length > 5" class="flex justify-center gap-2 mt-6">
            <button v-for="index in totalDots" :key="index" @click="goToSlide(index - 1)"
                class="rounded-full transition-all cursor-pointer"
                :class="currentSlide === index - 1 ? 'bg-blue-600 w-8 h-3' : 'bg-gray-400 w-3 h-3 hover:bg-gray-500'"
                :aria-label="`Go to position ${index}`"></button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    products: {
        type: Array,
        required: true
    }
});

const currentSlide = ref(0);

// Each product is 20% width (5 products = 100%)
const slidePercentage = 20;

// Maximum slide position (total products - 5)
const maxSlide = computed(() => Math.max(0, props.products.length - 5));

// Total dots needed
const totalDots = computed(() => maxSlide.value + 1);

const nextSlide = () => {
    if (currentSlide.value < maxSlide.value) {
        currentSlide.value++;
    }
};

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--;
    }
};

const goToSlide = (index) => {
    currentSlide.value = Math.min(index, maxSlide.value);
};
</script>