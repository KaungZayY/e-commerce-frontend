<template>
    <footer class="w-full bg-gray-900 py-8 px-4">
        <div
            class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <!-- Brand Text -->
            <div class="flex items-center justify-center md:justify-start">
                <h2 class="text-white text-xl sm:text-2xl font-semibold">E Commerce</h2>
            </div>

            <!-- Navigation Links -->
            <nav class="flex flex-wrap items-center justify-center gap-3 sm:gap-5 text-white text-sm font-medium">
                <NuxtLink to="/contact-us" :class="[
                    'hover:text-blue-400 transition-colors',
                    route.path === '/contact-us' ? 'text-gray-400' : ''
                ]">
                    CONTACT US
                </NuxtLink>
                <NuxtLink to="/refund-and-returns-policy" :class="[
                    'hover:text-blue-400 transition-colors',
                    route.path === '/refund-and-returns-policy' ? 'text-gray-400' : ''
                ]">
                    REFUND & RETURNS POLICY
                </NuxtLink>
                <NuxtLink to="/terms-and-conditions" :class="[
                    'hover:text-blue-400 transition-colors',
                    route.path === '/terms-and-conditions' ? 'text-gray-400' : ''
                ]">
                    TERMS & CONDITIONS
                </NuxtLink>
                <NuxtLink to="/privacy-policy" :class="[
                    'hover:text-blue-400 transition-colors',
                    route.path === '/privacy-policy' ? 'text-gray-400' : ''
                ]">
                    PRIVACY POLICY
                </NuxtLink>
            </nav>

            <!-- Year Text -->
            <div class="text-gray-400 text-xs sm:text-sm text-center md:text-right">
                © E Commerce 2025
            </div>
        </div>
    </footer>
</template>

<script setup>
const route = useRoute();
</script>

<style scoped>
/* 📱 Mobile */
@media (max-width: 640px) {
    footer {
        text-align: center;
    }

    nav {
        flex-direction: column;
        gap: 0.5rem;
    }

    h2 {
        font-size: 1.25rem;
    }
}

/* 💻 Tablet (640px–1023px) */
@media (min-width: 640px) and (max-width: 1023px) {
    .max-w-7xl {
        flex-direction: column;
        text-align: center;
        gap: 1.25rem;
    }

    nav {
        justify-content: center;
        gap: 0.75rem;
    }

    h2 {
        font-size: 1.5rem;
    }

    nav a {
        font-size: 0.875rem;
    }

    .text-gray-400 {
        font-size: 0.8rem;
    }
}

/* 🖥 Desktop (≥1024px) */
@media (min-width: 1024px) {
    nav a {
        font-size: 0.9rem;
    }

    h2 {
        font-size: 1.5rem;
    }
}
</style>
