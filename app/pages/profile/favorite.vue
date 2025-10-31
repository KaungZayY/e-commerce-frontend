<template>
    <div class="w-full px-6 lg:px-20 py-8">
        <!-- Header with Breadcrumb and Pagination -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <BreadCrumb :items="breadcrumbItems" />
            <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
        </div>

        <!-- Loading State -->
        <Spinner v-if="loading" />

        <!-- Empty State -->
        <div v-else-if="products.length === 0" class="text-center py-12">
            <p class="text-gray-600 text-lg">No products found.</p>
        </div>

        <!-- Products Grid -->
        <div v-else>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>

            <!-- Bottom Pagination (optional) -->
            <div v-if="totalPages > 1" class="flex justify-center mt-8">
                <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
            </div>
        </div>
    </div>
</template>


<script setup>
import { toast } from 'vue-sonner'

const breadcrumbItems = [
    { label: 'Profile' },
    { label: 'Wishlist' },
]

const spinner = ref(false);

const products = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// --- Fetch Products ---
const fetchData = async () => {
    loading.value = true
    try {
        const baseParams = {
            perPage: pageSize.value,
            page: currentPage.value,
        }

        const params = { ...baseParams }

        const response = await useApi('/favorites', { params })
        // console.log(response)
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

        totalItems.value = response.products.total
    } catch (error) {
        toast.error('Failed to load products.')
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchData()
})

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchData()
    }
}
</script>