<template>
    <div class="flex px-20 py-8 gap-4">
        <!-- Sidebar Filters (optional) -->
        <div class="w-1/5" v-if="showPriceFilter">
            <PriceRangeFilter :min="filter.price_range?.start ?? 0" :max="filter.price_range?.end ?? 5000"
                @filter="handleFilter" />
        </div>

        <!-- Main Product Area -->
        <div :class="showPriceFilter ? 'w-4/5' : 'w-full'">
            <div class="flex justify-between items-center mb-4">
                <BreadCrumb :items="breadcrumbItems" />
                <div class="flex items-center space-x-4">
                    <ProductSort v-model="selectedSort" @sort-change="fetchData" />
                    <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
                </div>
            </div>

            <Spinner v-if="loading" />
            <div v-else-if="products.length === 0">
                <p class="text-gray-600">No products found.</p>
            </div>
            <div v-else>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <ProductCard v-for="product in products" :key="product.id" :product="product" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { toast } from 'vue-sonner'

const props = defineProps({
    filter: {
        type: Object,
        default: () => ({
            price_range: null,
            stock: null,
            category_id: null,
            sort: 'created_at_desc'
        })
    },
    breadcrumbItems: { // ✅ New prop
        type: Array,
        default: () => []
    },
    showPriceFilter: { type: Boolean, default: true }
})

const products = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedSort = ref(props.filter.sort || 'created_at_desc')
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// --- Fetch Products ---
const fetchData = async () => {
    loading.value = true
    try {
        const baseParams = {
            perPage: pageSize.value,
            page: currentPage.value,
            sort: selectedSort.value || props.filter.sort || 'created_at_desc',
        }

        // Build dynamic params based on props.filter
        const extraParams = {}

        // Price range
        if (props.filter.price_range?.start != null && props.filter.price_range?.end != null) {
            extraParams['price_range[start]'] = props.filter.price_range.start
            extraParams['price_range[end]'] = props.filter.price_range.end
        }

        // Stock filters
        if (props.filter.stock?.onSale) extraParams.on_sale = 1
        if (props.filter.stock?.inStock) extraParams.in_stock = 1
        if (props.filter.stock?.onBackorder) extraParams.on_backorder = 1

        // Add any other filters (like category_id, is_popular, etc.)
        for (const [key, value] of Object.entries(props.filter)) {
            if (!['price_range', 'stock', 'sort'].includes(key) && value != null) {
                extraParams[key] = value
            }
        }

        const params = { ...baseParams, ...extraParams }

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

        totalItems.value = response.products.total
    } catch (error) {
        toast.error('Failed to load products.')
    } finally {
        loading.value = false
    }
}

// --- Handlers ---
const handleFilter = (filterData) => {
    props.filter.price_range = filterData.priceRange
    props.filter.stock = filterData.stock
    currentPage.value = 1
    fetchData()
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchData()
    }
}

onMounted(() => {
    fetchData()
})
</script>
