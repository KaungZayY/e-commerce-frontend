<template>
    <div class="bg-gray-50 min-h-screen">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
            <BreadCrumb :items="breadcrumbItems" class="mb-4 sm:mb-6" />

            <div class="flex flex-col lg:flex-row gap-4 sm:gap-8 bg-white p-4 sm:p-8 rounded-lg shadow-sm">
                <!-- Left: Image Slider -->
                <div class="w-full lg:w-1/2">
                    <ImageSlider :images="images" />
                </div>

                <!-- Right: Product Information -->
                <div class="w-full lg:w-1/2">
                    <!-- Product Title -->
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                        {{ product_name }}
                    </h1>

                    <!-- Price -->
                    <div class="mb-4 sm:mb-6">
                        <div v-if="hasDiscount" class="space-y-2">
                            <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <span class="text-3xl sm:text-4xl font-bold text-blue-600">RM{{ formatPrice(finalPrice)
                                    }}</span>
                                <span
                                    class="bg-blue-100 text-blue-600 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                    {{ discountLabel }}
                                </span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-lg sm:text-xl text-gray-400 line-through">RM{{ formatPrice(price)
                                    }}</span>
                                <span class="text-green-600 font-semibold text-xs sm:text-sm">
                                    You save RM{{ formatPrice(discountValue) }}
                                </span>
                            </div>
                        </div>
                        <div v-else>
                            <span class="text-3xl sm:text-4xl font-bold text-blue-600">RM{{ formatPrice(price) }}</span>
                        </div>
                    </div>

                    <!-- Stock Status -->
                    <div v-if="stockQty > 0" class="mb-4 flex items-center gap-2">
                        <span class="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span class="text-green-600 font-medium text-sm sm:text-base">In Stock</span><span
                            class="text-blue-600 font-medium ml-4 text-sm sm:text-base">{{ stockQty }} available</span>
                    </div>

                    <!-- Wholesale Notice -->
                    <div v-if="category_id == 21 || category_id == 22"
                        class="mb-4 bg-yellow-50 border-l-4 border-yellow-500 p-3 sm:p-4 rounded-r-lg">
                        <div class="flex items-start gap-2">
                            <i class="pi pi-info-circle text-yellow-600 mt-0.5"></i>
                            <div>
                                <p class="text-yellow-800 font-semibold text-sm sm:text-base mb-1">Wholesale Product</p>
                                <p class="text-yellow-700 text-xs sm:text-sm">
                                    This is a wholesale item. Minimum order quantity (MOQ) of {{ moq }} units required.
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Quantity Selector & Buttons -->
                    <div class="space-y-3 mb-4 sm:mb-6">
                        <div v-if="category_id !== 21 && category_id !== 22"
                            class="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                            <span class="text-gray-700 font-medium text-sm sm:text-base">Quantity:</span>
                            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button @click="decreaseQty"
                                    class="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition font-semibold text-lg"
                                    :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
                                    :disabled="quantity <= 1">
                                    −
                                </button>
                                <input v-model.number="quantity" type="number" min="1"
                                    class="w-16 h-10 text-center border-x border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900" />
                                <button @click="increaseQty"
                                    class="w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition font-semibold text-lg">
                                    +
                                </button>
                            </div>
                        </div>
                        <div v-else>
                            <QtyInput id="quantity" label="Quantity:" v-model="quantity"
                                :error="quantity_error ? quantity_error : ''" />
                        </div>

                        <div class="flex flex-col sm:flex-row gap-3">
                            <button @click="handleAddToCart"
                                class="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg uppercase text-xs sm:text-sm tracking-wide">
                                <i class="pi pi-shopping-cart mr-2"></i>
                                ADD TO CART
                            </button>

                            <button @click="buyNow"
                                class="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold py-3 sm:py-3.5 px-4 sm:px-6 rounded-lg hover:from-gray-800 hover:to-gray-700 transition-all shadow-md hover:shadow-lg uppercase text-xs sm:text-sm tracking-wide">
                                <i class="pi pi-bolt mr-2"></i>
                                BUY NOW
                            </button>
                        </div>
                    </div>

                    <!-- Wishlist -->
                    <div class="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                        <button @click="toggleWishlist" class="flex items-center gap-2 transition group"
                            :class="is_favorite ? 'text-red-600' : 'text-gray-700 hover:text-red-600'">
                            <i class="text-lg sm:text-xl transition-transform"
                                :class="is_favorite ? 'pi pi-heart-fill' : 'pi pi-heart group-hover:scale-110'"></i>
                            <span class="font-medium text-sm sm:text-base">
                                {{ is_favorite ? 'Remove from Wishlist' : 'Add to Wishlist' }}
                            </span>
                        </button>
                    </div>

                    <!-- Share Section -->
                    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                        <span class="text-gray-800 font-semibold text-sm sm:text-base">Share:</span>
                        <div class="flex gap-2 flex-wrap">
                            <button
                                class="text-gray-600 hover:text-blue-600 transition p-2 sm:p-2.5 hover:bg-blue-50 rounded-full">
                                <i class="pi pi-facebook text-base sm:text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-blue-400 transition p-2 sm:p-2.5 hover:bg-blue-50 rounded-full">
                                <i class="pi pi-twitter text-base sm:text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-red-600 transition p-2 sm:p-2.5 hover:bg-red-50 rounded-full">
                                <i class="pi pi-pinterest text-base sm:text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-blue-700 transition p-2 sm:p-2.5 hover:bg-blue-50 rounded-full">
                                <i class="pi pi-linkedin text-base sm:text-lg"></i>
                            </button>
                            <button
                                class="text-gray-600 hover:text-green-600 transition p-2 sm:p-2.5 hover:bg-green-50 rounded-full">
                                <i class="pi pi-whatsapp text-base sm:text-lg"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Description Section -->
            <div class="mt-6 sm:mt-8">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Product Description</h2>
                <div class="[&_ul]:list-disc [&_ul]:pl-6 [&_li]:mb-1 text-sm sm:text-base" v-html="description"></div>

            </div>

            <div class="flex flex-col lg:flex-row gap-4 sm:gap-8">
                <div class="w-full lg:w-1/2">
                    <ProductsReviews :key="reviewsKey" :product_id="Number(route.params.id)" class="mt-6 sm:mt-8"
                        @edit="editReview" />
                </div>
                <div class="w-full lg:w-1/2">
                    <ProductsReviewForm :key="formKey" :product_id="Number(route.params.id)" :id="selectedId"
                        class="mt-6 sm:mt-8" @success="onReviewSuccess" @cancel="cancelEdit" />
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

const router = useRouter();
const spinner = ref(false);
const route = useRoute()
const id = Number(route.params.id)
const quantity_error = ref('')

// Import cart composable
const { addToCart } = useCart()

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
    },
    'Wholesale': {
        slug: 'wholesale',
        subcategories: {
            'Telecom & Mobile Devices': 'telecom-mobile',
            'General Wholesale': 'general',
        }
    },
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
const moq = ref(null);

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
const handleAddToCart = () => {
    quantity_error.value = null // clear old errors

    // 🧩 Check for MOQ restriction for category 21 or 22
    if ((category_id.value === 21 || category_id.value === 22) && quantity.value < moq.value) {
        quantity_error.value = `Minimum order quantity is ${moq.value}`
        toast.error(`Please order at least ${moq.value} units.`)
        return // stop execution
    }

    if (stockQty.value > 0 && quantity.value > stockQty.value) {
        quantity_error.value = `Only ${stockQty.value} unit(s) available in stock.`
        toast.error(`You can only add up to ${stockQty.value} unit(s) to cart.`)
        return
    }

    const productData = {
        id: id,
        product_name: product_name.value,
        price: finalPrice.value, // Use final price after discount
        original_price: parseFloat(price.value),
        discount_type: discount_type.value,
        discount_amount: discount_amount.value,
        images: images.value
    }

    addToCart(productData, quantity.value)
    toast.success(`Added ${quantity.value} item(s) to cart`)
}

const buyNow = () => {
    quantity_error.value = null // clear old errors

    // 🧩 Check for MOQ restriction for category 21 or 22
    if ((category_id.value === 21 || category_id.value === 22) && quantity.value < moq.value) {
        quantity_error.value = `Minimum order quantity is ${moq.value}`
        toast.error(`Please order at least ${moq.value} units.`)
        return // stop execution
    }

    if (stockQty.value > 0 && quantity.value > stockQty.value) {
        quantity_error.value = `Only ${stockQty.value} unit(s) available in stock.`
        toast.error(`You can only add up to ${stockQty.value} unit(s) to cart.`)
        return
    }

    const productData = {
        id: id,
        product_name: product_name.value,
        price: finalPrice.value, // Use final price after discount
        original_price: parseFloat(price.value),
        discount_type: discount_type.value,
        discount_amount: discount_amount.value,
        images: images.value
    }

    addToCart(productData, quantity.value)
    router.push(`/checkout`)
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
        moq.value = response.product?.moq || null;
        // console.log(response)
    } catch (error) {
        // console.log(error)
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
    formKey.value++
}

const cancelEdit = () => {
    selectedId.value = null
}
</script>