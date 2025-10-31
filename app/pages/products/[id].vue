<template>
    <div class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-6 py-8">
            <BreadCrumb :items="breadcrumbItems" class="mb-6" />

            <div class="flex gap-8">
                <!-- Left: Image Slider -->
                <div class="w-1/2">
                    <ImageSlider :images="images" />
                </div>

                <!-- Right: Product Information -->
                <div class="w-1/2 bg-white p-8 rounded-lg shadow-sm">
                    <!-- Product Title -->
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">
                        {{ product_name }}
                    </h1>

                    <!-- Price -->
                    <div class="mb-6">
                        <div v-if="hasDiscount" class="space-y-2">
                            <div class="flex items-center gap-3">
                                <span class="text-4xl font-bold text-blue-600">RM{{ formatPrice(finalPrice) }}</span>
                                <span class="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
                                    {{ discountLabel }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xl text-gray-400 line-through">RM{{ formatPrice(price) }}</span>
                                <span class="text-green-600 font-semibold text-sm">
                                    You save RM{{ formatPrice(discountValue) }}
                                </span>
                            </div>
                        </div>
                        <div v-else>
                            <span class="text-4xl font-bold text-blue-600">RM{{ formatPrice(price) }}</span>
                        </div>
                    </div>

                    <!-- Stock Status -->
                    <div v-if="stockQty > 0" class="mb-4 flex items-center gap-2">
                        <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span class="text-green-600 font-medium">In Stock</span>
                    </div>

                    <!-- Quantity Selector & Buttons -->
                    <div class="space-y-3 mb-6">
                        <div class="flex items-center gap-2">
                            <span class="text-gray-700 font-medium min-w-[80px]">Quantity:</span>
                            <div class="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                                <button @click="decreaseQty"
                                    class="px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 transition font-semibold">
                                    -
                                </button>
                                <input v-model.number="quantity" type="number" min="1"
                                    class="w-16 text-center border-x-2 border-gray-300 py-2 focus:outline-none font-semibold text-gray-900" />
                                <button @click="increaseQty"
                                    class="px-4 py-2 text-xl text-gray-700 hover:bg-gray-100 transition font-semibold">
                                    +
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <button @click="addToCart"
                                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3.5 px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg uppercase text-sm tracking-wide">
                                <i class="pi pi-shopping-cart mr-2"></i>
                                ADD TO CART
                            </button>

                            <button @click="buyNow"
                                class="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-3.5 px-6 rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg uppercase text-sm tracking-wide">
                                <i class="pi pi-bolt mr-2"></i>
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    <!-- Wishlist -->
                    <div class="mb-6 pb-6 border-b border-gray-200">
                        <button @click="toggleWishlist" class="flex items-center gap-2 transition group"
                            :class="is_favorite ? 'text-red-600' : 'text-gray-700 hover:text-red-600'">
                            <i class="text-xl transition-transform"
                                :class="is_favorite ? 'pi pi-heart-fill' : 'pi pi-heart group-hover:scale-110'"></i>
                            <span class="font-medium">
                                {{ is_favorite ? 'Remove from Wishlist' : 'Add to Wishlist' }}
                            </span>
                        </button>
                    </div>

                    <!-- Share Section -->
                    <div class="flex items-center gap-4">
                        <span class="text-gray-800 font-semibold">Share:</span>
                        <div class="flex gap-2">
                            <button
                                class="text-gray-600 hover:text-blue-600 transition p-2.5 hover:bg-blue-50 rounded-full">
                                <i class="pi pi-facebook text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-blue-400 transition p-2.5 hover:bg-blue-50 rounded-full">
                                <i class="pi pi-twitter text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-red-600 transition p-2.5 hover:bg-red-50 rounded-full">
                                <i class="pi pi-pinterest text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-blue-700 transition p-2.5 hover:bg-blue-50 rounded-full">
                                <i class="pi pi-linkedin text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-green-600 transition p-2.5 hover:bg-green-50 rounded-full">
                                <i class="pi pi-whatsapp text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description Section -->
            <div class="mt-8 bg-white p-8 rounded-lg shadow-sm">
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Product Description</h2>
                <div class="prose max-w-none text-gray-700" v-html="description"></div>
            </div>

            <div class="flex gap-8">
                <div class="w-1/2">
                    <ProductsReviews :key="reviewsKey" :product_id="Number(route.params.id)" class="mt-8" @edit="editReview"/>
                </div>
                <div class="w-1/2">
                    <ProductsReviewForm :key="formKey" :product_id="Number(route.params.id)" :id="selectedId" class="mt-8" @success="onReviewSuccess" @cancel="cancelEdit"/>
                </div>
            </div>

            <Recommended v-if="category_id" :category_id="category_id" :product_id="Number(route.params.id)" />
        </div>

        <Spinner v-if="spinner" />
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner';
import Recommended from '~/components/Products/Recommended.vue';

const spinner = ref(false);
const route = useRoute()
const id = Number(route.params.id)

const reviewsKey = ref(0)
const onReviewSuccess = () => {
    reviewsKey.value++
}

// Category navigation mapping based on navbar structure
const categoryNavMap = {
    'Mobile Phones': {
        slug: 'phones',
        subcategories: {
            'Smart Phones': 'smart',
            'Feature Phones': 'feature',
            'Refurbished Phones': 'refurbished'
        }
    },
    'Accessories': {
        slug: 'accessories',
        subcategories: {
            'Chargers': 'chargers',
            'Earphones': 'earphones',
            'Cases': 'cases',
            'Powerbanks': 'powerbanks'
        }
    },
    'Electronics': {
        slug: 'electronics',
        subcategories: {
            'Smart Watches': 'smart-watches',
            'Tablets': 'tablets',
            'Bluetooth Speakers': 'bluetooth-speakers',
            'Cameras': 'cameras'
        }
    },
    'Networking': {
        slug: 'networking',
        subcategories: {
            'Routers': 'routers',
            'Wi-Fi Devices': 'wifi-devices',
            'Cables': 'cables',
            'Modems': 'modems'
        }
    }
}

const breadcrumbItems = computed(() => {
    const items = [{ label: 'Home', href: '/' }];

    // Look up main category slug from mapping
    const mainCatConfig = categoryNavMap[main_category_name.value];
    if (mainCatConfig) {
        // items.push({
        //     label: main_category_name.value,
        //     href: `/${mainCatConfig.slug}`
        // });

        // Look up subcategory slug from mapping
        const subCatSlug = mainCatConfig.subcategories[category_name.value];
        if (subCatSlug) {
            items.push({
                label: category_name.value,
                href: `/${mainCatConfig.slug}/${subCatSlug}`
            });
        } else if (category_name.value) {
            // Fallback: just show category name without link
            items.push({ label: category_name.value });
        }
    } else if (main_category_name.value) {
        // Fallback: show main category without link
        items.push({ label: main_category_name.value });
        if (category_name.value) {
            items.push({ label: category_name.value });
        }
    }

    // Add product name (no link, current page)
    items.push({ label: product_name.value || '' });

    return items;
})

const formatPrice = (value) => {
    const num = parseFloat(value)
    if (Number.isInteger(num)) return num.toString()
    return num.toFixed(2)
}

const product_name = ref('');
const main_category_name = ref('')
const category_id = ref('')
const category_name = ref('');
const images = ref([]);
const price = ref('')
const description = ref('')
const discount_type = ref('')
const discount_amount = ref('')
const quantity = ref(1)
const stockQty = ref(0)
const is_favorite = ref(false)

// Discount calculations
const hasDiscount = computed(() => {
    return discount_type.value && discount_amount.value && parseFloat(discount_amount.value) > 0
})

const discountValue = computed(() => {
    if (!hasDiscount.value) return 0

    const priceNum = parseFloat(price.value)
    const discountNum = parseFloat(discount_amount.value)

    if (discount_type.value === 'amount') {
        return discountNum
    } else if (discount_type.value === 'percentage') {
        return (priceNum * discountNum) / 100
    }
    return 0
})

const finalPrice = computed(() => {
    if (!hasDiscount.value) return parseFloat(price.value)
    return parseFloat(price.value) - discountValue.value
})

const discountLabel = computed(() => {
    if (!hasDiscount.value) return ''

    if (discount_type.value === 'amount') {
        return `-RM${formatPrice(discount_amount.value)}`
    } else if (discount_type.value === 'percentage') {
        return `-${discount_amount.value}%`
    }
    return ''
})

// Quantity handlers
const increaseQty = () => {
    quantity.value++
}

const decreaseQty = () => {
    if (quantity.value > 1) {
        quantity.value--
    }
}

// Action handlers
const addToCart = () => {
    toast.success(`Added ${quantity.value} item(s) to cart`)
}

const buyNow = () => {
    toast.info('Redirecting to checkout...')
}

const toggleWishlist = () => {
    if (is_favorite.value) {
        remove_from_wishlist()
    } else {
        add_to_wishlist()
    }
}

const add_to_wishlist = async () => {
    if (!id) return;
    try {
        await useApi(`/favorites`, {
            method: 'POST',
            body: { product_id: id }
        });
        is_favorite.value = true;
        toast.success('Product added to your wishlist.');
    } catch (error) {
        console.log(error);
        toast.error('Failed to add product to wishlist.');
    }
}

const remove_from_wishlist = async () => {
    if (!id) return;
    try {
        await useApi(`/favorites/${id}`, {
            method: 'DELETE'
        });
        is_favorite.value = false;
        toast.success('Product removed from your wishlist.');
    } catch (error) {
        console.log(error);
        toast.error('Failed to remove product from wishlist.');
    }
}

const fetchData = async () => {
    if (!id) return;
    spinner.value = true;
    try {
        const response = await useApi(`/products/${id}`);
        product_name.value = response.product?.product_name || '';
        category_name.value = response.product?.category?.category_name || '';
        main_category_name.value = response.product?.category?.parent_category?.category_name || '';
        images.value = response.product.images || [];
        price.value = response.product?.price || '';
        description.value = response.product?.description || '';
        discount_type.value = response.product?.discount_type || '';
        discount_amount.value = response.product?.discount_amount || '';
        stockQty.value = response.product?.qty || 0;
        is_favorite.value = response.product?.is_favorited || false;
        category_id.value = response.product?.category_id || '';
        // console.log(response)
    } catch (error) {
        console.log(error)
        toast.error('Failed to load product info.')
    } finally {
        spinner.value = false
    }
}

onMounted(() => {
    fetchData()
})

const selectedId = ref(null)
const formKey = ref(0)
const editReview = (review) => {
    selectedId.value = review.id
    // console.log(review.id)
    formKey.value++
}

const cancelEdit = () => {
    selectedId.value = null
}
</script>