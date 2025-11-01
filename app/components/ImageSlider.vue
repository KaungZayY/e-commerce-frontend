<template>
    <div class="relative w-full max-w-2xl mx-auto">
        <!-- Main Image Display -->
        <div class="relative w-full rounded-lg overflow-hidden flex items-center justify-center"
            style="aspect-ratio: 1 / 1; max-height: 600px;">
            <img v-if="fullImagePaths.length > 0" :src="fullImagePaths[currentIndex]" :alt="`Image ${currentIndex + 1}`"
                class="max-w-[80%] max-h-[90%] object-contain transition-opacity duration-300"
                @error="handleImageError" />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                <i class="pi pi-image text-6xl"></i>
            </div>

            <!-- Navigation Arrows -->
            <template v-if="fullImagePaths.length > 1">
                <!-- Left Arrow -->
                <button @click="previousImage"
                    class="absolute left-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="currentIndex === 0 && !loop">
                    <i class="pi pi-chevron-left text-gray-800 text-lg"></i>
                </button>

                <!-- Right Arrow -->
                <button @click="nextImage"
                    class="absolute right-4 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-50 rounded-full w-12 h-12 flex items-center justify-center shadow-lg transition-all hover:scale-110 disabled:opacity-40 disabled:cursor-not-allowed"
                    :disabled="currentIndex === fullImagePaths.length - 1 && !loop">
                    <i class="pi pi-chevron-right text-gray-800 text-lg"></i>
                </button>
            </template>

            <!-- Image Counter -->
            <div v-if="fullImagePaths.length > 1 && showCounter"
                class="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium">
                {{ currentIndex + 1 }} / {{ fullImagePaths.length }}
            </div>

            <!-- Fullscreen Button -->
            <button v-if="fullImagePaths.length > 0" @click="openFullscreen"
                class="absolute bottom-4 left-4 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg transition-all hover:scale-110">
                <i class="pi pi-search-plus text-gray-800"></i>
            </button>
        </div>

        <!-- Thumbnail Navigation (Optional) -->
        <div v-if="showThumbnails && fullImagePaths.length > 1" class="flex gap-2 mt-4 overflow-x-auto pb-2">
            <button v-for="(image, index) in fullImagePaths" :key="index" @click="currentIndex = index"
                class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all" :class="[
                    currentIndex === index
                        ? 'border-blue-600 ring-2 ring-blue-200'
                        : 'border-gray-300 hover:border-gray-400'
                ]">
                <img :src="image" :alt="`Thumbnail ${index + 1}`" class="w-full h-full object-cover" />
            </button>
        </div>

        <!-- Dot Indicators (Alternative to thumbnails) -->
        <div v-if="showDots && !showThumbnails && fullImagePaths.length > 1" class="flex justify-center gap-2 mt-4">
            <button v-for="(image, index) in fullImagePaths" :key="index" @click="currentIndex = index"
                class="transition-all rounded-full" :class="[
                    currentIndex === index
                        ? 'bg-blue-600 w-8 h-2.5'
                        : 'bg-gray-300 hover:bg-gray-400 w-2.5 h-2.5'
                ]"></button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    images: {
        type: Array,
        default: () => []
    },
    loop: {
        type: Boolean,
        default: true
    },
    showThumbnails: {
        type: Boolean,
        default: false
    },
    showDots: {
        type: Boolean,
        default: true
    },
    showCounter: {
        type: Boolean,
        default: true
    }
})

const config = useRuntimeConfig()
const currentIndex = ref(0)

// Convert image paths to full URLs
const fullImagePaths = computed(() => {
    if (!props.images || props.images.length === 0) return []

    return props.images.map(imagePath => {
        // If already a full URL, return as is
        if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
            return imagePath
        }
        // Otherwise, construct full path with /file/ endpoint
        return `${config.public.apiBase}/file/${imagePath}`
    })
})

// Navigation functions
const nextImage = () => {
    if (currentIndex.value < fullImagePaths.value.length - 1) {
        currentIndex.value++
    } else if (props.loop) {
        currentIndex.value = 0
    }
}

const previousImage = () => {
    if (currentIndex.value > 0) {
        currentIndex.value--
    } else if (props.loop) {
        currentIndex.value = fullImagePaths.value.length - 1
    }
}

// Fullscreen functionality
const openFullscreen = () => {
    if (fullImagePaths.value.length > 0) {
        window.open(fullImagePaths.value[currentIndex.value], '_blank')
    }
}

// Handle image load error
const handleImageError = (event) => {
    console.error('Failed to load image:', event.target.src)
    event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f3f4f6" width="400" height="400"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="24" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E'
}

// Keyboard navigation
const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
        previousImage()
    } else if (event.key === 'ArrowRight') {
        nextImage()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
})

// Watch for prop changes
watch(() => props.images, () => {
    currentIndex.value = 0
}, { deep: true })
</script>

<style scoped>
@import 'primeicons/primeicons.css';

button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

button:disabled:hover {
    transform: none !important;
    background-color: white !important;
}

/* Smooth scrollbar for thumbnails */
.overflow-x-auto::-webkit-scrollbar {
    height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
    background: #555;
}
</style>