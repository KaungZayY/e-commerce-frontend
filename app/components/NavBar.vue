<template>
    <nav class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Brand/Logo on left -->
                <div class="shrink-0 flex items-center">
                    <NuxtLink to="/" class="text-xl font-bold text-blue-700 whitespace-nowrap">E Commerce</NuxtLink>
                </div>

                <!-- Center nav tabs desktop only -->
                <div class="hidden lg:flex flex-1 justify-center px-4">
                    <div class="flex items-center space-x-1 text-sm">
                        <NuxtLink to="/"
                            :class="[isActiveHome ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'px-3 py-2 rounded-md text-sm transition-colors hover:underline whitespace-nowrap']">
                            Home</NuxtLink>

                        <!-- Shop -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('shop')"
                                :class="[isActiveShop ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Shop
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'shop'"
                                class="absolute z-20 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template
                                    v-for="(item, idx) in [{ label: 'All Products', to: '/shop/all-products' }, { label: 'New Arrivals', to: '/shop/new-arrivals' }, { label: 'Best Sellers', to: '/shop/best-sellers' }]"
                                    :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 2 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>

                        <!-- Mobile Phones -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('phones')"
                                :class="[isActivePhones ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Mobile Phones
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'phones'"
                                class="absolute z-20 left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template v-for="(item, idx) in [
                                    { label: 'Smart Phones', to: '/phones/smart' },
                                    { label: 'Feature Phones', to: '/phones/feature' },
                                    { label: 'Refurbished Phones', to: '/phones/refurbished' }
                                ]" :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 2 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>

                        <!-- Accessories Tab -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('accessories')"
                                :class="[isActiveAccessories ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Accessories
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'accessories'"
                                class="absolute z-20 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template v-for="(item, idx) in [
                                    { label: 'Chargers', to: '/accessories/chargers' },
                                    { label: 'Earphones', to: '/accessories/earphones' },
                                    { label: 'Cases', to: '/accessories/cases' },
                                    { label: 'Powerbanks', to: '/accessories/powerbanks' }
                                ]" :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 3 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>

                        <!-- Electronics Tab -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('electronics')"
                                :class="[isActiveElectronics ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Electronics
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'electronics'"
                                class="absolute z-20 left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template v-for="(item, idx) in [
                                    { label: 'Smart Watches', to: '/electronics/smart-watches' },
                                    { label: 'Tablets', to: '/electronics/tablets' },
                                    { label: 'Bluetooth Speakers', to: '/electronics/bluetooth-speakers' },
                                    { label: 'Cameras', to: '/electronics/cameras' }
                                ]" :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 3 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>

                        <!-- Networking Tab -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('networking')"
                                :class="[isActiveNetworking ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Networking
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'networking'"
                                class="absolute z-20 right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template v-for="(item, idx) in [
                                    { label: 'Routers Wi-Fi Devices', to: '/networking/routers' },
                                    { label: 'Cables', to: '/networking/cables' },
                                    { label: 'Modems', to: '/networking/modems' }
                                ]" :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 2 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>

                        <!-- Deals Tab -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('deals')"
                                :class="[isActiveDeals ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Deals
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'deals'"
                                class="absolute z-20 right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template v-for="(item, idx) in [
                                    { label: 'Flash Deals', to: '/deals/flash' },
                                    { label: 'Discount Bundles', to: '/deals/discount-bundles' }
                                ]" :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 1 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>

                        <!-- Wholesale Tab -->
                        <div class="relative">
                            <button @click="setDesktopDropdown('wholesale')"
                                :class="[isActiveWholesale ? 'text-blue-600 font-bold underline' : 'text-black font-bold', 'flex items-center px-3 py-2 rounded-md text-sm transition-colors whitespace-nowrap hover:underline']">
                                Wholesale
                                <svg class="ml-1 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div v-if="desktopDropdown === 'wholesale'"
                                class="absolute z-20 right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-blue-100"
                                @mouseleave="desktopDropdown = ''">
                                <template v-for="(item, idx) in [
                                    { label: 'Telecom & Mobile Devices', to: '/wholesale/telecom-mobile' },
                                    { label: 'General Wholesales', to: '/wholesale/general' }
                                ]" :key="item.to">
                                    <NuxtLink :to="item.to"
                                        :class="[isRoute(item.to) ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50', idx < 1 ? 'border-b border-gray-200' : '']">
                                        {{ item.label }}
                                    </NuxtLink>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Desktop: right side icons and auth -->
                <div class="hidden lg:flex gap-2 shrink-0 items-center">
                    <!-- Un Auth User Login-->
                    <NuxtLink to="/login" v-if="user_role == null"
                        class="text-black font-semibold px-3 py-2 text-sm hover:text-blue-700 hover:underline whitespace-nowrap">
                        Login/Register</NuxtLink>
                    <NuxtLink to="/search" class="text-black p-2 hover:text-blue-700"><i
                            class="pi pi-search text-xl"></i></NuxtLink>
                    <NuxtLink to="/favorites" class="text-black p-2 hover:text-blue-700"><i
                            class="pi pi-heart text-xl"></i></NuxtLink>
                    <NuxtLink to="/cart" class="text-black p-2 hover:text-blue-700"><i
                            class="pi pi-shopping-cart text-xl"></i>
                    </NuxtLink>

                    <!-- Profile Dropdown -->
                    <div class="relative">
                        <button @click="setDesktopDropdown('profile')" class="text-black p-2 hover:text-blue-700">
                            <i class="pi pi-user text-xl"></i>
                        </button>
                        <div v-if="desktopDropdown === 'profile'"
                            class="absolute z-20 right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-blue-100"
                            @mouseleave="desktopDropdown = ''">
                            <!-- Auth User Access -->
                            <NuxtLink to="/profile" v-if="user_role !== null"
                                :class="[isRoute('/profile') ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50 border-b border-gray-200']">
                                Profile
                            </NuxtLink>
                            <!-- Admin Access-->
                            <NuxtLink to="/products" v-if="user_role == 1"
                                :class="[isRoute('/products') ? 'text-blue-600' : 'text-black', 'font-semibold block px-4 py-2 text-sm hover:bg-blue-50 border-b border-gray-200']">
                                Products
                            </NuxtLink>
                            <div class="p-2">
                                <LoadingBtn label="Logout" loadingLabel="Logging out..." :loading="loggingOut"
                                    icon="sign-out" @click="handleLogout" variant="danger" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mobile menu button-->
                <div class="flex lg:hidden ml-auto">
                    <button @click="mobileOpen = !mobileOpen"
                        class="inline-flex items-center justify-center p-2 rounded-md text-black hover:text-blue-800 focus:outline-none">
                        <svg v-if="!mobileOpen" class="block h-6 w-6" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                        <svg v-else class="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="mobileOpen" class="lg:hidden px-4 pb-3">
            <NuxtLink to="/"
                :class="[isActiveHome ? 'text-blue-600 font-bold' : 'text-black font-bold', 'block px-3 py-2 rounded-md text-base transition']">
                Home</NuxtLink>
            <div class="flex flex-col">
                <TabbedMobileDropdown label="Shop" :active="isActiveShop" :open="mobileDropdown === 'shop'"
                    @toggle="setMobileDropdown('shop')"
                    :items="[{ label: 'All Products', to: '/shop/all-products' }, { label: 'New Arrivals', to: '/shop/new-arrivals' }, { label: 'Best Sellers', to: '/shop/best-sellers' }]" />
                <TabbedMobileDropdown label="Mobile Phones" :active="isActivePhones" :open="mobileDropdown === 'phones'"
                    @toggle="setMobileDropdown('phones')"
                    :items="[{ label: 'Smart Phones', to: '/phones/smart' }, { label: 'Feature Phones', to: '/phones/feature' }, { label: 'Refurbished Phones', to: '/phones/refurbished' }]" />
                <TabbedMobileDropdown label="Accessories" :active="isActiveAccessories"
                    :open="mobileDropdown === 'accessories'" @toggle="setMobileDropdown('accessories')"
                    :items="[{ label: 'Chargers', to: '/accessories/chargers' }, { label: 'Earphones', to: '/accessories/earphones' }, { label: 'Cases', to: '/accessories/cases' }, { label: 'Powerbanks', to: '/accessories/powerbanks' }]" />
                <TabbedMobileDropdown label="Electronics" :active="isActiveElectronics"
                    :open="mobileDropdown === 'electronics'" @toggle="setMobileDropdown('electronics')"
                    :items="[{ label: 'Smart Watches', to: '/electronics/smart-watches' }, { label: 'Tablets', to: '/electronics/tablets' }, { label: 'Bluetooth Speakers', to: '/electronics/bluetooth-speakers' }, { label: 'Cameras', to: '/electronics/cameras' }]" />
                <TabbedMobileDropdown label="Networking" :active="isActiveNetworking"
                    :open="mobileDropdown === 'networking'" @toggle="setMobileDropdown('networking')"
                    :items="[{ label: 'Routers Wi-Fi Devices', to: '/networking/routers' }, { label: 'Cables', to: '/networking/cables' }, { label: 'Modems', to: '/networking/modems' }]" />
                <TabbedMobileDropdown label="Deals" :active="isActiveDeals" :open="mobileDropdown === 'deals'"
                    @toggle="setMobileDropdown('deals')"
                    :items="[{ label: 'Flash Deals', to: '/deals/flash' }, { label: 'Discount Bundles', to: '/deals/discount-bundles' }]" />
                <TabbedMobileDropdown label="Wholesale" :active="isActiveWholesale"
                    :open="mobileDropdown === 'wholesale'" @toggle="setMobileDropdown('wholesale')"
                    :items="[{ label: 'Telecom & Mobile Devices', to: '/wholesale/telecom-mobile' }, { label: 'General Wholesales', to: '/wholesale/general' }]" />

                <!-- Mobile: auth + icons -->
                <NuxtLink to="/login" class="text-black font-semibold px-3 py-2 text-base mt-2">Login/Register
                </NuxtLink>
                <div class="flex gap-4 px-3 py-2">
                    <NuxtLink to="/search" class="text-black p-2 hover:text-blue-700"><i
                            class="pi pi-search text-lg"></i>
                    </NuxtLink>
                    <NuxtLink to="/favorites" class="text-black p-2 hover:text-blue-700"><i
                            class="pi pi-heart text-lg"></i>
                    </NuxtLink>
                    <NuxtLink to="/cart" class="text-black p-2 hover:text-blue-700"><i
                            class="pi pi-shopping-cart text-lg"></i>
                    </NuxtLink>
                </div>

                <!-- Mobile Profile Section -->
                <div class="px-3 py-2 border-t border-gray-200 mt-2">
                    <NuxtLink to="/profile" class="text-black font-semibold block py-2 hover:text-blue-700">
                        Profile
                    </NuxtLink>
                    <NuxtLink to="/products" class="text-black font-semibold block py-2 hover:text-blue-700">
                        Products
                    </NuxtLink>
                    <div class="mt-2">
                        <LoadingBtn label="Logout" loadingLabel="Logging out..." :loading="loggingOut" icon="sign-out"
                            @click="handleLogout" />
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { toast } from 'vue-sonner'

// For mobile item dropdowns
const mobileOpen = ref(false);
const mobileDropdown = ref('');
function setMobileDropdown(key) {
    mobileDropdown.value = mobileDropdown.value === key ? '' : key;
}

// Desktop dropdowns
const route = useRoute();
const router = useRouter();
const desktopDropdown = ref('');

function setDesktopDropdown(key) {
    desktopDropdown.value = desktopDropdown.value === key ? '' : key;
}

const user_role = computed(() => {
    if (process.client) {
        return localStorage.getItem('user_role') || ''
    }
    return ''
})

// Logout functionality
const loggingOut = ref(false);
const handleLogout = async () => {
    loggingOut.value = true;
    try {
        await useApi('/logout', {
            method: 'POST'
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_role');
        toast.success('Logout Successful!.')
        router.push('/auth/login');
    } catch (error) {
        console.log(error)
        toast.error('Logout Failed!.')
    } finally {
        loggingOut.value = false;
        desktopDropdown.value = '';
    }
};

const isRoute = (comparison) => route.path === comparison;
const isActiveHome = computed(() => route.path === '/');
const isActiveShop = computed(() => route.path.startsWith('/shop'));
const isActivePhones = computed(() => route.path.startsWith('/phones'));
const isActiveAccessories = computed(() => route.path.startsWith('/accessories'));
const isActiveElectronics = computed(() => route.path.startsWith('/electronics'));
const isActiveNetworking = computed(() => route.path.startsWith('/networking'));
const isActiveDeals = computed(() => route.path.startsWith('/deals'));
const isActiveWholesale = computed(() => route.path.startsWith('/wholesale'));
</script>

<style scoped>
@import 'primeicons/primeicons.css';
</style>