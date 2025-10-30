<template>
    <div class="relative group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all hover:cursor-pointer duration-300"
        @click="goToDetailsPage">
        <!-- Product Image -->
        <div class="relative w-full h-40 flex items-center justify-center overflow-hidden">
            <img :src="image" :alt="product.product_name"
                class="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105" />

            <!-- HOT Badge -->
            <div v-if="product.is_popular === 'Yes'"
                class="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-red-600 text-white text-[10px] font-bold rounded-full shadow">
                HOT
            </div>

            <!-- Discount Badge -->
            <div v-if="hasDiscount"
                class="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold rounded-full shadow">
                {{ discountShort }}
            </div>

            <!-- Hover Add to Cart -->
            <div class="absolute bottom-0 left-0 right-0 h-1/5 translate-y-full group-hover:translate-y-0
        transition-transform duration-300 ease-out
        bg-blue-100/90 text-blue-700 text-xs font-semibold flex items-center justify-center">
                ADD TO CART
            </div>
        </div>

        <!-- Product Details -->
        <div class="p-3 text-center">
            <h3 class="text-gray-800 font-medium text-sm line-clamp-2 leading-tight">
                {{ product.product_name }}
            </h3>
            <p class="text-gray-500 text-xs mt-0.5">Accessories</p>

            <!-- Price -->
            <div class="mt-1">
                <template v-if="hasDiscount">
                    <p class="text-gray-400 text-xs line-through">
                        RM{{ product.price }}
                    </p>
                    <p class="text-blue-600 font-semibold text-sm">
                        RM{{ discountedPrice }}
                    </p>
                </template>
                <template v-else>
                    <p class="text-blue-600 font-semibold text-sm">
                        RM{{ product.price }}
                    </p>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    product: { type: Object, required: true },
})

const hasDiscount = computed(() => {
    const p = props.product
    return p.discount_amount && Number(p.discount_amount) > 0
})

const discountedPrice = computed(() => {
    const p = props.product
    const price = Number(p.price)
    const discount = Number(p.discount_amount)
    if (p.discount_type === 'amount') return (price - discount).toFixed(2)
    if (p.discount_type === 'percentage') return (price - price * (discount / 100)).toFixed(2)
    return p.price
})

const discountShort = computed(() => {
    const p = props.product
    return p.discount_type === 'amount' ? `-${p.discount_amount}` : `-${p.discount_amount}%`
})

const product = computed(() => props.product)

const image = computed(() => {
    const config = useRuntimeConfig()
    return `${config.public.apiBase}/file/${product.value.images[0]}`
})

const goToDetailsPage = () => {
    const router = useRouter()
    router.push(`/products/${product.value.id}`)
}
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
