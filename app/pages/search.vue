<template>
    <div class="w-full px-6 lg:px-20 py-8">
        <div class="flex justify-center">
            <div class="relative w-full max-w-2xl">
                <i class="pi pi-search absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl"></i>
                <input type="text" v-model="search" placeholder="Search for products..." @keyup.enter="fetchData"
                    class="w-full pl-14 pr-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600 transition" />
            </div>
        </div>

        <div>
            <div class="flex justify-end mb-4">
                <Pagination :current-page="currentPage" :total-pages="totalPages" @change-page="goToPage" />
            </div>
            <Spinner v-if="loading" />
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductCard v-for="product in products" :key="product.id" :product="product" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const search = ref('')

const spinner = ref(false);

const products = ref([])
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))

const fetchData = async () => {
    spinner.value = true
    try {
        let params = {
            perPage: pageSize.value,
            page: currentPage.value,
        }
        if (search.value) {
            params['product_name'] = search.value;
        }
        const response = await useApi('/products', {
            params: params
        });
        products.value = response.products.data.map((item) => ({
            id: item.id,
            images: item.images,
            product_image: item.images && item.images.length > 0 ? item.images[0] : null,
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
        // console.log(response)
    } catch (error) {
        console.log(error)
        toast.error('Failed to load products.')
    } finally {
        spinner.value = false;
    }
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        fetchData()
    }
}
</script>