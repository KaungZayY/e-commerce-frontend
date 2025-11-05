<template>
    <div class="w-full bg-cover bg-center relative flex flex-col items-center justify-center text-center"
        :style="{ height, backgroundImage: `url(${defaultImage})` }">
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/40"></div>

        <!-- Content -->
        <div class="relative z-10 space-y-3 px-4">
            <!-- Title -->
            <h1 class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                {{ label }}
            </h1>

            <!-- Breadcrumb -->
            <div v-if="breadcrumbItems?.length" class="flex justify-center">
                <BreadCrumb :items="breadcrumbItems" class="breadcrumb-custom" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const props = defineProps({
    label: { type: String, required: true },
    height: { type: String, default: '200px' },
    breadcrumbItems: {
        type: Array as PropType<
            {
                label: string
                href?: string
                icon?: Component
            }[]
        >,
        default: () => []
    }
})

const defaultImage = '/images/banner.png'
</script>

<style scoped>
h1 {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

/* --- Breadcrumb Styling --- */
:deep(.breadcrumb-custom nav),
:deep(.breadcrumb-custom a),
:deep(.breadcrumb-custom span) {
    color: rgba(255, 255, 255, 0.85);
}

/* Links (with href) – brighter and bold */
:deep(.breadcrumb-custom a) {
    color: #fff;
    font-weight: 600;
    transition: color 0.2s ease;
}

:deep(.breadcrumb-custom a:hover) {
    text-decoration: underline;
    color: #ffffff;
}

/* Current (no href) – dimmer */
:deep(.breadcrumb-custom span) {
    color: rgba(255, 255, 255, 0.7);
}
</style>
