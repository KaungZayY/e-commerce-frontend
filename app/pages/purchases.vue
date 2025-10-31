<template>
    <div class="container mx-auto px-5 py-7 text-[15px]">
        <h1 class="text-2xl font-bold mb-5">My Orders</h1>

        <!-- Loading -->
        <Spinner v-if="loading" />

        <!-- Empty -->
        <div v-else-if="!orders || orders.length === 0" class="text-center py-10">
            <div class="text-gray-400 mb-4">
                <svg class="mx-auto h-20 w-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-700 mb-1">No orders yet</h2>
            <p class="text-gray-500 mb-5">Start shopping to see your orders here</p>
            <button class="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition">
                Start Shopping
            </button>
        </div>

        <!-- Orders -->
        <div v-else class="space-y-5">
            <div v-for="order in orders" :key="order.id"
                class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <!-- Header -->
                <div
                    class="bg-gray-50 px-5 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
                    <div>
                        <h3 class="font-semibold text-gray-800 text-lg">Order {{ order.generated_id }}</h3>
                        <p class="text-sm text-gray-500">{{ formatDate(order.created_at) }}</p>
                    </div>
                    <div class="flex items-center gap-4">
                        <span :class="getStatusClass(order.status)"
                            class="px-3 py-1 rounded-full text-sm font-medium capitalize">
                            {{ order.status }}
                        </span>
                        <div class="text-right">
                            <p class="text-xs text-gray-500">Total</p>
                            <p class="text-lg font-bold text-gray-900">${{ order.total_amount.toFixed(2) }}</p>
                        </div>
                    </div>
                </div>

                <!-- Products -->
                <div class="px-5 py-4">
                    <h4 class="font-medium text-gray-700 text-sm mb-3">Order Items</h4>
                    <div class="space-y-3">
                        <div v-for="product in order.products" :key="product.id"
                            class="flex gap-4 pb-3 border-b border-gray-100 last:border-0">
                            <img :src="getProductImage(product.images)" :alt="product.product_name"
                                class="h-12 w-12 object-contain rounded flex-shrink-0" />
                            <div class="flex-grow">
                                <h5 class="font-semibold text-gray-800 text-[15px]">{{ product.product_name }}</h5>
                                <p class="text-sm text-gray-500">Qty: {{ product.pivot.qty }}</p>
                                <div class="flex items-center gap-2 mt-1.5">
                                    <span class="text-sm font-medium text-gray-900">${{
                                        product.pivot.final_unit_price.toFixed(2)
                                        }}</span>
                                    <span v-if="hasDiscount(product)" class="text-sm text-gray-400 line-through">${{
                                        parseFloat(product.price).toFixed(2)
                                        }}</span>
                                    <span v-if="hasDiscount(product)"
                                        class="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
                                        {{ getDiscountLabel(product) }}
                                    </span>
                                </div>
                            </div>
                            <div class="text-right text-sm font-semibold text-gray-900">
                                ${{ product.pivot.subtotal.toFixed(2) }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="bg-gray-50 px-5 py-3 border-t border-gray-200">
                    <button @click="toggleCustomerInfo(order.id)"
                        class="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2 w-full justify-center">
                        <i :class="isExpanded(order.id) ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"></i>
                        {{ isExpanded(order.id) ? 'Hide' : 'Show' }} Customer Information
                    </button>

                    <div v-if="isExpanded(order.id)" class="mt-3 pt-3 border-t border-gray-100 text-sm text-gray-600">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-1">Customer</h4>
                                <p>{{ order.first_name }} {{ order.last_name }}</p>
                                <p>{{ order.customer_email }}</p>
                                <p>{{ order.customer_phone }}</p>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-700 mb-1">Address</h4>
                                <p>{{ order.customer_address }}</p>
                                <p>{{ order.city }}, {{ order.state }}</p>
                                <p>{{ order.postal_code }}</p>
                            </div>
                        </div>
                        <div v-if="order.note" class="mt-3">
                            <h4 class="font-semibold text-gray-700 mb-0.5">Note</h4>
                            <p>{{ order.note }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner';

const config = useRuntimeConfig();
const loading = ref(false);
const orders = ref([]);
const expandedOrders = ref(new Set());

const fetchData = async () => {
    loading.value = true;
    try {
        const response = await useApi('/orders', {
            method: 'GET',
        });
        orders.value = response.orders || [];
    } catch (error) {
        console.error(error);
        toast.error('Failed to load order data.');
    } finally {
        loading.value = false;
    }
};

const toggleCustomerInfo = (orderId) => {
    if (expandedOrders.value.has(orderId)) {
        expandedOrders.value.delete(orderId);
    } else {
        expandedOrders.value.add(orderId);
    }
};

const isExpanded = (orderId) => {
    return expandedOrders.value.has(orderId);
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getStatusClass = (status) => {
    const classes = {
        pending: 'bg-yellow-100 text-yellow-800',
        processing: 'bg-blue-100 text-blue-800',
        shipped: 'bg-purple-100 text-purple-800',
        delivered: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};

const getProductImage = (images) => {
    try {
        const imageArray = typeof images === 'string' ? JSON.parse(images) : images;
        if (!imageArray || imageArray.length === 0) return '/placeholder-product.png';

        const firstImage = imageArray[0];
        if (firstImage.startsWith('http://') || firstImage.startsWith('https://')) {
            return firstImage;
        }
        return `${config.public.apiBase}/file/${firstImage}`;
    } catch {
        return '/placeholder-product.png';
    }
};

const hasDiscount = (product) => {
    return product.discount_amount && product.discount_amount > 0;
};

const getDiscountLabel = (product) => {
    if (product.discount_type === 'percentage') {
        return `-${product.discount_amount}%`;
    }
    return `-$${product.discount_amount}`;
};

onMounted(() => {
    fetchData();
});
</script>