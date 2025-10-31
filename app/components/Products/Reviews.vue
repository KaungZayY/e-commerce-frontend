<template>
    <div>
        <PageTitle label="Customer Reviews" />

        <div v-if="reviews?.data?.length > 0" class="space-y-4 mt-6">
            <!-- Reviews List -->
            <div class="space-y-4">
                <div v-for="review in reviews.data" :key="review.id"
                    class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 relative">
                    <!-- User Info and Rating -->
                    <div class="flex items-start justify-between mb-3">
                        <div>
                            <h3 class="font-semibold text-gray-900">{{ review.user?.name || 'Anonymous' }}</h3>
                            <p class="text-xs text-gray-500">{{ formatDate(review.created_at) }}</p>
                        </div>

                        <!-- Three-dot menu -->
                        <div v-if="isOwner(review.user_id)" class="relative">
                            <button @click="toggleMenu(review.id)"
                                class="text-gray-600 hover:text-gray-900 transition p-1">
                                <i class="pi pi-ellipsis-v text-xl"></i>
                            </button>

                            <!-- Dropdown -->
                            <div v-if="activeMenu === review.id"
                                class="absolute right-0 mt-2 w-24 bg-white border border-gray-200 rounded shadow-md z-10">
                                <button @click="editReview(review)"
                                    class="flex items-center gap-2 px-3 py-2 w-full text-left text-gray-700 hover:bg-gray-100">
                                    <i class="pi pi-pencil"></i> Edit
                                </button>
                                <button @click="deleteReview(review)"
                                    class="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-gray-100">
                                    <i class="pi pi-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Star Rating -->
                    <div class="flex gap-0.5 mb-2">
                        <svg v-for="star in 5" :key="star" xmlns="http://www.w3.org/2000/svg" :class="[
                            'w-4 h-4',
                            star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-none text-gray-300'
                        ]" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                        </svg>
                    </div>

                    <!-- Review Text -->
                    <p class="text-gray-700 text-sm leading-relaxed">{{ review.review }}</p>
                </div>

            </div>

            <!-- Pagination -->
            <div v-if="reviews?.last_page > 1"
                class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-600">
                    Showing {{ reviews.from }} to {{ reviews.to }} of {{ reviews.total }} reviews
                </div>

                <div class="flex gap-2">
                    <!-- Previous Button -->
                    <button @click="goToPage(reviews.current_page - 1)" :disabled="!reviews.prev_page_url"
                        class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="reviews.prev_page_url
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400'">
                        Previous
                    </button>

                    <!-- Page Numbers -->
                    <div class="flex gap-1">
                        <button v-for="page in displayPages" :key="page" @click="page !== '...' && goToPage(page)"
                            :class="[
                                'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                                page === reviews.current_page
                                    ? 'bg-blue-600 text-white'
                                    : page === '...'
                                        ? 'bg-transparent text-gray-400 cursor-default'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            ]" :disabled="page === '...'">
                            {{ page }}
                        </button>
                    </div>

                    <!-- Next Button -->
                    <button @click="goToPage(reviews.current_page + 1)" :disabled="!reviews.next_page_url"
                        class="px-3 py-1.5 text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        :class="reviews.next_page_url
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400'">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-else-if="reviews === null" class="text-center py-12">
            <p class="text-sm text-gray-500">Loading reviews...</p>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 class="mt-2 text-sm font-semibold text-gray-900">No reviews yet</h3>
            <p class="mt-1 text-sm text-gray-500">Be the first to review this product.</p>
        </div>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'

const props = defineProps({
    product_id: {
        type: Number,
        required: true
    },
});

const reviews = ref(null)

const fetchData = async (page = 1) => {
    try {
        const response = await useApi(`/products/${props.product_id}/reviews?page=${page}`, {
            method: 'GET',
        })
        reviews.value = response

    } catch (error) {
        console.log(error)
        toast.error('Failed to load reviews.')
    }
}

const goToPage = (page) => {
    if (reviews.value && page >= 1 && page <= reviews.value.last_page) {
        fetchData(page)
    }
}

// Generate page numbers with ellipsis for large page counts
const displayPages = computed(() => {
    if (!reviews.value) return []

    const pages = []
    const current = reviews.value.current_page
    const last = reviews.value.last_page

    if (last <= 7) {
        // Show all pages if 7 or fewer
        for (let i = 1; i <= last; i++) {
            pages.push(i)
        }
    } else {
        // Always show first page
        pages.push(1)

        if (current > 3) {
            pages.push('...')
        }

        // Show pages around current
        const start = Math.max(2, current - 1)
        const end = Math.min(last - 1, current + 1)

        for (let i = start; i <= end; i++) {
            pages.push(i)
        }

        if (current < last - 2) {
            pages.push('...')
        }

        // Always show last page
        pages.push(last)
    }

    return pages
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

onMounted(() => {
    fetchData()
})

const activeMenu = ref(null)

// Toggle which review menu is open
const toggleMenu = (reviewId) => {
    activeMenu.value = activeMenu.value === reviewId ? null : reviewId
}

// Check if current user is the owner
const isOwner = (userId) => {
    return Number(localStorage.getItem('id')) === userId
}

const emits = defineEmits(['edit'])
// Edit review handler
const editReview = (review) => {
    emits('edit', review)
}

// Delete review handler
const deleteReview = async (review) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
        await useApi(`/products/${props.product_id}/reviews/${review.id}`, {
            method: 'DELETE'
        })
        toast.success('Review deleted.')
        fetchData() // refresh the list
    } catch (err) {
        toast.error('Failed to delete review.')
    }
}
</script>