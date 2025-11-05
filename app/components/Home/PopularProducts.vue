<template>
    <div class="mt-8 mb-10">
        <h1 class="text-3xl md:text-4xl font-bold mb-10 text-center">
            Popular Products
        </h1>

        <Spinner v-if="loading" />
        <div v-else class="px-4 sm:px-8 md:px-20 lg:px-40">
            <!-- 🧱 Product Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const products = ref([])
const loading = ref(false)
const isMobile = ref(false)
const isTablet = ref(false)

// --- Screen size detection ---
const checkScreenSize = () => {
    const width = window.innerWidth
    isMobile.value = width < 640
    isTablet.value = width >= 640 && width < 1024
}

// --- Fetch Products ---
const fetchData = async () => {
    loading.value = true
    try {
        // Adjust per-page dynamically
        const perPage = isMobile.value ? 5 : isTablet.value ? 8 : 10

        const params = {
            perPage,
            page: 1,
            is_popular: 1
        }

        const response = await useApi('/products', { params })
        const config = useRuntimeConfig()

        products.value = response.products.data.map((item) => ({
            id: item.id,
            images: item.images,
            product_image:
                item.images && item.images.length > 0
                    ? `${config.public.apiBase}/${item.images[0]}`
                    : null,
            product_name: item.product_name,
            price: item.price,
            qty: item.qty,
            description: item.description,
            is_popular: item.is_popular ? 'Yes' : 'No',
            discount_type: item.discount_type,
            discount_amount: item.discount_amount,
            created_by: item.created_by_user?.name || '',
            category_name: item.category?.category_name || ''
        }))
    } catch (error) {
        toast.error('Failed to load products.')
    } finally {
        loading.value = false
    }
}

// --- Lifecycle ---
onMounted(() => {
    checkScreenSize()
    fetchData()
    window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
/* 📱 Mobile heading adjustments */
@media (max-width: 640px) {
    h1 {
        font-size: 2rem;
        margin-bottom: 2rem;
    }
}

@media (max-width: 480px) {
    h1 {
        font-size: 1.75rem;
        margin-bottom: 1.5rem;
    }
}

/* 💻 Tablet layout: 2 products per row */
@media (min-width: 640px) and (max-width: 1023px) {
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}
</style>
