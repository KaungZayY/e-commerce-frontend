<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-6">
        <div class="w-full max-w-4xl bg-white p-4 sm:p-6 rounded shadow">
            <div class="relative mb-4 sm:mb-6 flex items-center justify-center">
                <PageTitle label="Order Checkout" />
            </div>

            <form @submit.prevent="checkout" class="">
                <div class="flex flex-col sm:flex-row gap-3">
                    <Textbox id="first_name" label="First Name" placeholder="John" v-model="first_name" :required="true"
                        :error="errors.first_name ? errors.first_name[0] : ''" />
                    <Textbox id="last_name" label="Last Name" placeholder="Smith" v-model="last_name" :required="true"
                        :error="errors.last_name ? errors.last_name[0] : ''" />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <Textbox id="customer_email" type="email" label="Email" placeholder="john@example.com"
                        v-model="customer_email" :required="true"
                        :error="errors.customer_email ? errors.customer_email[0] : ''" />
                    <Textbox id="customer_phone" label="Phone" placeholder="" v-model="customer_phone" :required="true"
                        :error="errors.customer_phone ? errors.customer_phone[0] : ''" />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <Textbox id="city" label="City" placeholder="Kuala Lumpur" v-model="city" :required="true"
                        :error="errors.city ? errors.city[0] : ''" />
                    <Textbox id="state" label="State" placeholder="" v-model="state" :required="true"
                        :error="errors.state ? errors.state[0] : ''" />
                    <Textbox id="postal_code" label="Postal Code" placeholder="111111" v-model="postal_code"
                        :required="true" :error="errors.postal_code ? errors.postal_code[0] : ''" />
                </div>
                <div>
                    <TextArea id="customer_address" label="Address" placeholder="123, Jalan ABC, Taman XYZ"
                        v-model="customer_address" :required="true" :rows="6"
                        :error="errors.customer_address ? errors.customer_address[0] : ''" />
                </div>
                <div>
                    <TextArea id="note" label="Order Note" placeholder="Additional information about your order..."
                        v-model="note" :rows="6" :error="errors.note ? errors.note[0] : ''" />
                </div>

                <!-- Cart Section -->
                <div class="border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h2 class="text-base sm:text-lg font-semibold mb-3">Your Cart</h2>
                    <div v-if="cart.length > 0">
                        <div v-for="(item, index) in cart" :key="item.id"
                            class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b py-3 gap-2 sm:gap-0">
                            <div class="flex items-start sm:items-center gap-3 w-full sm:w-auto">
                                <img :src="item.image" alt=""
                                    class="w-16 h-16 sm:w-16 sm:h-16 object-cover rounded flex-shrink-0" />
                                <div class="flex-1 min-w-0">
                                    <p class="font-medium text-gray-800 text-sm sm:text-base break-words">
                                        {{ item.name }} × {{ item.quantity }}
                                    </p>
                                    <p class="text-xs sm:text-sm text-gray-500">RM{{ item.price.toFixed(2) }} each</p>
                                </div>
                            </div>
                            <p class="font-semibold text-sm sm:text-base self-end sm:self-auto">RM{{ (item.price *
                                item.quantity).toFixed(2) }}</p>
                        </div>

                        <!-- Totals -->
                        <div class="mt-4 border-t pt-3">
                            <div class="flex justify-between text-gray-700 mb-1 text-sm sm:text-base">
                                <span>Subtotal</span>
                                <span>RM{{ totalAmount.toFixed(2) }}</span>
                            </div>
                            <div class="flex justify-between text-base sm:text-lg font-semibold text-blue-700">
                                <span>Total</span>
                                <span>RM{{ totalAmount.toFixed(2) }}</span>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center text-gray-500 py-6 text-sm sm:text-base">
                        Your cart is empty.
                    </div>
                </div>

                <!-- Payment Methods Section -->
                <!-- Payment Methods Section -->
                <div class="border rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                    <h2 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Payment Methods</h2>

                    <div class="space-y-2 sm:space-y-3">
                        <!-- Cash Payment -->
                        <label
                            class="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition"
                            :class="payment_method === 'cash' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'">
                            <input type="radio" name="payment_method" value="cash" v-model="payment_method"
                                class="mt-0.5 sm:mt-1 w-4 h-4 flex-shrink-0 text-blue-600 focus:ring-blue-500" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <i class="pi pi-money-bill text-green-600 text-sm sm:text-base"></i>
                                    <span class="font-medium text-gray-900 text-sm sm:text-base">Pay by Cash</span>
                                </div>
                                <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1">Pay with cash upon delivery
                                </p>
                            </div>
                        </label>

                        <!-- Credit Card Payment (Disabled) -->
                        <label
                            class="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg opacity-50 cursor-not-allowed bg-gray-50 border-gray-200">
                            <input type="radio" name="payment_method" value="credit_card" disabled
                                class="mt-0.5 sm:mt-1 w-4 h-4 flex-shrink-0 text-gray-400" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <i class="pi pi-credit-card text-gray-400 text-sm sm:text-base"></i>
                                    <span class="font-medium text-gray-500 text-sm sm:text-base">Credit Card
                                        Payment</span>
                                    <span
                                        class="text-xs bg-gray-200 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">Coming
                                        Soon</span>
                                </div>
                                <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Currently unavailable</p>
                            </div>
                        </label>

                        <!-- Online Banking (Disabled) -->
                        <label
                            class="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 border rounded-lg opacity-50 cursor-not-allowed bg-gray-50 border-gray-200">
                            <input type="radio" name="payment_method" value="online_banking" disabled
                                class="mt-0.5 sm:mt-1 w-4 h-4 flex-shrink-0 text-gray-400" />
                            <div class="flex-1 min-w-0">
                                <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <i class="pi pi-building text-gray-400 text-sm sm:text-base"></i>
                                    <span class="font-medium text-gray-500 text-sm sm:text-base">Online Banking</span>
                                    <span
                                        class="text-xs bg-gray-200 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full whitespace-nowrap">Coming
                                        Soon</span>
                                </div>
                                <p class="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">Currently unavailable</p>
                            </div>
                        </label>
                    </div>

                    <!-- Error Message -->
                    <p v-if="errors.payment_method" class="text-red-600 text-xs sm:text-sm mt-2">
                        {{ errors.payment_method[0] }}
                    </p>
                </div>

                <div class="w-full flex justify-end">
                    <div class="w-full sm:w-auto sm:min-w-[120px]">
                        <LoadingBtn :label="'Checkout'" :loading-label="'Processing...'" :loading="loading"
                            type="submit" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner';
const router = useRouter();
const errors = ref({});
const loading = ref(false);
const cart = ref([]);

const first_name = ref('');
const last_name = ref('');
const customer_email = ref('');
const customer_phone = ref('');
const city = ref('');
const state = ref('');
const postal_code = ref('');
const customer_address = ref('');
const note = ref('');
const payment_method = ref('cash');

// Load cart from localStorage
onMounted(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
        cart.value = JSON.parse(savedCart);
    }
});

// Calculate total
const totalAmount = computed(() =>
    cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
);


// Checkout submission
const checkout = async () => {
    if (cart.value.length === 0) {
        toast.error("Your cart is empty.");
        return;
    }

    loading.value = true;
    errors.value = {};

    try {
        const payload = {
            first_name: first_name.value,
            last_name: last_name.value,
            customer_email: customer_email.value,
            customer_phone: customer_phone.value,
            city: city.value,
            state: state.value,
            postal_code: postal_code.value,
            customer_address: customer_address.value,
            note: note.value,
            total_amount: totalAmount.value,
            cart: cart.value.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                final_unit_price: item.price
            })),
        };

        await useApi('/orders', {
            method: 'POST',
            body: payload,
        });

        toast.success("Order placed successfully!");
        localStorage.removeItem("cart");
        router.push(`/`).then(() => {
            window.location.reload();
        });
    } catch (error) {
        if (error.statusCode === 422 && error.data?.errors) {
            errors.value = error.data.errors;
            toast.error('Please fix the validation errors.')
        } else if (error.statusCode === 400 || error.statusCode === 404) {
            toast.error(error.data.message || 'An error occurred while placing your order.')
        } else {
            toast.error('Something went wrong while placing your order.')
        }
    } finally {
        loading.value = false;
    }
};
</script>