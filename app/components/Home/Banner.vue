<template>
    <div class="w-full overflow-hidden relative h-[500px]">
        <div ref="containerRef" class="w-full h-full overflow-hidden">
            <div ref="sliderRef" class="flex h-full"
                :class="{ 'transition-transform duration-700 ease-in-out': isTransitioning }"
                :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
                <!-- Render images with duplicates for seamless infinite loop -->
                <div v-for="(banner, index) in displayBanners" :key="index"
                    class="w-full h-full relative flex-shrink-0">
                    <img :src="banner.image" :alt="banner.alt" class="w-full h-full object-cover" />

                    <!-- Text overlay with dynamic positioning -->
                    <div class="absolute p-5 max-w-[600px] z-10" :class="banner.textClasses"
                        :style="banner.textPosition">
                        <h2 class="text-5xl font-bold mb-2.5 text-black">
                            {{ banner.title }}
                        </h2>
                        <p class="text-2xl mb-2 text-gray-600">
                            {{ banner.subtitle }}
                        </p>
                        <p v-if="banner.subtext" class="text-lg mb-5 text-gray-500">
                            {{ banner.subtext }}
                        </p>
                        <NuxtLink v-if="banner.buttonText" :to="banner.buttonLink"
                            class="inline-block bg-blue-600 hover:bg-blue-800 text-white px-8 py-3 text-base font-bold rounded cursor-pointer transition-colors">
                            {{ banner.buttonText }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Left Arrow - ALWAYS VISIBLE -->
        <button @click="prevSlide"
            class="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
            </svg>
        </button>

        <!-- Right Arrow - ALWAYS VISIBLE -->
        <button @click="nextSlide"
            class="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-all z-20 shadow-lg">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
            </svg>
        </button>

        <!-- Navigation dots -->
        <div class="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            <button v-for="(banner, index) in banners" :key="index" @click="goToSlide(index)"
                class="rounded-full transition-all cursor-pointer"
                :class="getActiveIndex() === index ? 'bg-white w-8 h-3' : 'bg-white/50 w-3 h-3 hover:bg-white/75'"
                :aria-label="`Go to slide ${index + 1}`"></button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const banners = [
    {
        image: '/images/banners/banner_1.png',
        alt: 'Banner 1',
        title: 'Summer Collection',
        subtitle: 'Up to 50% off on selected items',
        subtext: 'Limited time offer on all summer essentials. Shop now and save big on your favorite styles!',
        buttonText: 'Shop Now',
        buttonLink: '/shop/all-products',
        textPosition: {
            bottom: '10%',
            left: '10%'
        },
        textClasses: 'text-left'
    },
    {
        image: '/images/banners/banner_2.jpg',
        alt: 'Banner 2',
        title: 'New Arrivals',
        subtitle: 'Discover the latest trends',
        buttonText: 'Explore',
        buttonLink: '/shop/new-arrivals',
        textPosition: {
            bottom: '10%',
            left: '10%',
        },
        textClasses: 'text-left'
    },
    {
        image: '/images/banners/banner_3.jpg',
        alt: 'Banner 3',
        title: 'Special Offer',
        subtitle: 'Up to 30% off on electronics with free shipping',
        buttonText: 'Learn More',
        buttonLink: '/deals/flash',
        textPosition: {
            bottom: '10%',
            right: '2%',
        },
        textClasses: 'text-left'
    }
];

const currentSlide = ref(0);
const isTransitioning = ref(true);
const containerRef = ref(null);
const sliderRef = ref(null);
let intervalId = null;

// Add banners twice for seamless infinite loop to the RIGHT only
const displayBanners = computed(() => [...banners, ...banners]);

const nextSlide = () => {
    if (!isTransitioning.value) return;

    currentSlide.value++;

    // When we reach the second set of images, reset to the beginning without transition
    if (currentSlide.value === banners.length) {
        setTimeout(() => {
            isTransitioning.value = false;
            currentSlide.value = 0;
            setTimeout(() => {
                isTransitioning.value = true;
            }, 50);
        }, 700);
    }

    resetInterval();
};

const prevSlide = () => {
    if (!isTransitioning.value) return;

    // If at first slide, jump to the last slide
    if (currentSlide.value === 0) {
        isTransitioning.value = false;
        currentSlide.value = banners.length;
        setTimeout(() => {
            isTransitioning.value = true;
            currentSlide.value = banners.length - 1;
        }, 50);
    } else {
        currentSlide.value--;
    }

    resetInterval();
};

const goToSlide = (index) => {
    currentSlide.value = index;
    resetInterval();
};

const getActiveIndex = () => {
    return currentSlide.value % banners.length;
};

const resetInterval = () => {
    if (intervalId) {
        clearInterval(intervalId);
    }
    startAutoScroll();
};

const startAutoScroll = () => {
    // Auto-scroll always goes RIGHT every 4 seconds
    intervalId = setInterval(() => {
        nextSlide();
    }, 4000);
};

onMounted(() => {
    startAutoScroll();
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<style scoped>
/* Tablet styles */
@media (max-width: 1024px) {
    .h-\[500px\] {
        height: 400px;
    }

    h2 {
        font-size: 2.5rem;
    }

    .max-w-\[600px\] {
        max-width: 500px;
    }
}

/* Mobile styles */
@media (max-width: 768px) {
    .h-\[500px\] {
        height: 350px;
    }

    .absolute.p-5 {
        padding: 1rem;
        max-width: 90% !important;
    }

    h2 {
        font-size: 1.75rem !important;
        margin-bottom: 0.5rem !important;
        line-height: 1.2;
    }

    p.text-2xl {
        font-size: 1.125rem !important;
        margin-bottom: 0.5rem !important;
    }

    p.text-lg {
        font-size: 0.875rem !important;
        margin-bottom: 1rem !important;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    .inline-block {
        padding: 0.625rem 1.5rem !important;
        font-size: 0.875rem !important;
    }

    /* Navigation arrows - smaller and closer to edges */
    button.absolute.left-4,
    button.absolute.right-4 {
        width: 36px !important;
        height: 36px !important;
    }

    button.absolute.left-4 {
        left: 0.5rem !important;
    }

    button.absolute.right-4 {
        right: 0.5rem !important;
    }

    button svg {
        width: 18px !important;
        height: 18px !important;
    }

    /* Navigation dots - smaller */
    .absolute.bottom-5 {
        bottom: 1rem !important;
    }

    .absolute.bottom-5 button {
        width: 6px !important;
        height: 6px !important;
    }

    .absolute.bottom-5 button.bg-white.w-8 {
        width: 20px !important;
        height: 6px !important;
    }
}

/* Small mobile styles */
@media (max-width: 480px) {
    .h-\[500px\] {
        height: 280px;
    }

    h2 {
        font-size: 1.5rem !important;
    }

    p.text-2xl {
        font-size: 1rem !important;
    }

    p.text-lg {
        font-size: 0.8rem !important;
        -webkit-line-clamp: 1;
    }

    .inline-block {
        padding: 0.5rem 1.25rem !important;
        font-size: 0.8rem !important;
    }
}
</style>