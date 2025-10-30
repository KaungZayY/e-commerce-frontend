<template>
    <div class="flex px-20 py-8 gap-4">
        <div class="w-1/5">
            <PriceRangeFilter :min="0" :max="5000" @filter="handleFilter" />
        </div>
        <div class="w-4/5">
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
import { toast } from 'vue-sonner'

const totalItems = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const products = ref([]);
const loading = ref(false);
const selectedSort = ref('')

const breadcrumbItems = computed(() => [
    { label: 'Shop' },
    { label: 'All Products' },
]);

// Filter state
const filters = ref({
    price_range: {
        start: null,
        end: null
    },
    stock: {
        onSale: false,
        inStock: false,
        onBackorder: false
    }
})

const totalPages = computed(() => {
    return Math.ceil(totalItems.value / pageSize.value)
})

const fetchData = async () => {
    loading.value = true
    try {
        let params = {
            perPage: pageSize.value,
            page: currentPage.value,
            // Price range
            ...(filters.value.price_range.start !== null && filters.value.price_range.end !== null
                ? {
                    'price_range[start]': filters.value.price_range.start,
                    'price_range[end]': filters.value.price_range.end,
                }
                : {}),
            // Stock filters
            ...(filters.value.stock.onSale ? { on_sale: 1 } : {}),
            ...(filters.value.stock.inStock ? { in_stock: 1 } : {}),
            ...(filters.value.stock.onBackorder ? { on_backorder: 1 } : {}),
            // Sort
            ...(selectedSort.value ? { sort: selectedSort.value } : {}),
        }

        const response = await useApi('/products', {
            params: params
        });

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
        }))

        totalItems.value = response.products.total
    } catch (error) {
        // console.log(error)
        toast.error('Failed to load products.')
    } finally {
        loading.value = false;
    }
}

const handleFilter = (filterData) => {
    filters.value.price_range = filterData.priceRange
    filters.value.stock = filterData.stock
    currentPage.value = 1 // Reset to first page when filtering
    fetchData()
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchData()
    }
}

onMounted(() => {
    fetchData();
})

</script>