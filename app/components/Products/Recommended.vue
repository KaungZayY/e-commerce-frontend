<template>
    <div class="pt-4 mt-4 border-t border-dotted">
        <PageTitle label="Related Products" />
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-4">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const props = defineProps({
    category_id: {
        type: Number,
        required: true
    },
    product_id: {
        type: Number,
        required: true
    },
});

const pageSize = ref(5)
const products = ref([])

const fetchData = async () => {
    try {
        const baseParams = {
            perPage: pageSize.value,
        }

        const params = { ...baseParams }
        const response = await useApi(`/categories/${props.category_id}/products/${props.product_id}`, { params })
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
        console.log(error)
        toast.error('Failed to load recommended products.')
    }
}

onMounted(() => {
    fetchData()
})
</script>