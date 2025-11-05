<template>
    <div class="google-map-iframe relative overflow-hidden rounded" :style="{ height: `${height}px` }">
        <iframe :title="title" :src="src" class="absolute inset-0 w-full h-full border-0" :loading="loading"
            :allowfullscreen="allowFullScreen" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    zoom: {
        type: Number,
        default: 14
    },
    marker: {
        type: Boolean,
        default: true
    },
    title: {
        type: String,
        default: 'Google Map Location'
    },
    allowFullScreen: {
        type: Boolean,
        default: false
    },
    loading: {
        type: String as () => 'lazy' | 'eager',
        default: 'lazy'
    },
    height: {
        type: Number,
        default: 600
    }
})

const src = computed(() => {
    const { lat, lng, zoom } = props
    return `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=${zoom}&output=embed`
})
</script>

<style scoped>
.google-map-iframe iframe {
    display: block;
}
</style>
