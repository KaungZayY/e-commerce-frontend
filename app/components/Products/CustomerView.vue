<template>
    <div class="px-4 sm:px-8 md:px-20 lg:px-40 py-8">
        <!-- Breadcrumb -->
        <div class="mb-6">
            <BreadCrumb :items="breadcrumbItems" />
        </div>

        <!-- Top Controls (Desktop only) -->
        <div class="hidden lg:flex justify-between items-center mb-6">
            <div class="flex items-center space-x-4">
                <ProductSort v-model="selectedSort" @sort-change="fetchData" />
            </div>
            <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
        </div>

        <!-- MOBILE & TABLET: Price Filter Centered on top -->
        <div v-if="showPriceFilter" class="block lg:hidden mb-6 flex justify-center">
            <PriceRangeFilter class="max-w-md w-full" min="0" max="5000" @filter="handleFilter" />
        </div>

        <!-- MAIN WRAPPER -->
        <div class="flex flex-col lg:flex-row gap-6">
            <!-- DESKTOP SIDEBAR -->
            <div v-if="showPriceFilter" class="hidden lg:block lg:w-1/5 mt-4 lg:mt-12">
                <PriceRangeFilter min="0" max="5000" @filter="handleFilter" />
            </div>

            <!-- PRODUCT AREA -->
            <div :class="showPriceFilter ? 'w-full lg:w-4/5' : 'w-full'">
                <Spinner v-if="loading" />

                <div v-else-if="products.length === 0" class="text-center text-gray-600">
                    No products found.
                </div>

                <div v-else>
                    <!-- Product Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ProductCard v-for="product in products" :key="product.id" :product="product" />
                    </div>

                    <!-- Pagination (for mobile & tablet) -->
                    <div class="flex justify-center mt-8 lg:hidden">
                        <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
                    </div>

                    <!-- Pagination (for desktop bottom) -->
                    <div class="hidden lg:flex justify-center mt-8">
                        <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
    breadcrumbItems: {
        type: Array,
        default: () => []
    },
    showPriceFilter: { type: Boolean, default: true }
})

const products = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(12)
const selectedSort = ref(props.filter.sort || 'created_at_desc')
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

// --- Detect screen size for pagination size ---
const checkScreenSize = () => {
    const width = window.innerWidth
    if (width < 1024) {
        // mobile & tablet
        pageSize.value = 6
    } else {
        pageSize.value = 12
    }
}

// --- Fetch products ---
const fetchData = async () => {
    loading.value = true
    try {
        const baseParams = {
            perPage: pageSize.value,
            page: currentPage.value,
            sort: selectedSort.value || props.filter.sort || 'created_at_desc'
        }

        const extraParams = {}

        // Price range
        if (
            props.filter.price_range?.start != null &&
            props.filter.price_range?.end != null
        ) {
            extraParams['price_range[start]'] = props.filter.price_range.start
            extraParams['price_range[end]'] = props.filter.price_range.end
        }

        // Stock filters
        if (props.filter.stock?.onSale) extraParams.on_sale = 1
        if (props.filter.stock?.inStock) extraParams.in_stock = 1
        if (props.filter.stock?.onBackorder) extraParams.on_backorder = 1

        // Other filters
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
/* 📱 Tablet & Mobile Styling */
@media (max-width: 1024px) {
    .price-filter {
        margin: 0 auto;
        max-width: 28rem;
    }

    .breadcrumb {
        margin-bottom: 1rem;
    }

    /* 2 products per row for tablet (≥640px <1024px) */
    .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    /* 1 per row for mobile (<640px) */
    @media (max-width: 640px) {
        .grid {
            grid-template-columns: repeat(1, minmax(0, 1fr));
        }
    }
}
</style>
