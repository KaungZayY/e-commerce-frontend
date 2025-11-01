<template>
    <div class="mt-8">
        <h1 class="text-3xl font-bold mb-10 text-center">
            Popular Products
        </h1>

        <Spinner v-if="loading" />
        <div v-else class="px-40">
            <ProductSlider :products="products" />
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const products = ref([])
const loading = ref(false)

// --- Fetch Products ---
const fetchData = async () => {
    loading.value = true
    try {
        const params = {
            perPage: 10,
            page: 1,
            is_popular: 1,
        }

        const response = await useApi('/products', { params })
        const config = useRuntimeConfig()

        products.value = response.products.data.map((item) => ({
            id: item.id,
            images: item.images,
            product_image: item.images && item.images.length > 0
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

onMounted(() => {
    fetchData()
})
</script>