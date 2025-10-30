<template>
    <div class="w-full bg-cover bg-center relative flex items-center justify-center"
        :style="{ height, backgroundImage: `url(${defaultImage})` }">
        <div class="absolute inset-0 bg-black/30"></div> <!-- overlay -->
        <h1 class="text-white text-5xl md:text-6xl font-bold text-center relative">
            {{ label }}
        </h1>
    </div>
</template>

<script setup>
const props = defineProps({
    label: { type: String, required: true },
    height: { type: String, default: '200px' }
})

const defaultImage = '/images/banner.png'
</script>

<style scoped>
/* optional: drop shadow for text */
h1 {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}
</style>
