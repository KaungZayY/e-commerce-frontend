<template>
    <div>
        <PageTitle v-if="!props.id" label="Add Review" />
        <PageTitle v-else label="Update Review" />
        <form @submit.prevent="submit">
            <StarRating v-model="rating" label="Your Rating" />
            <TextArea v-model="review" id="review" label="Your Review" :rows="6" class="mt-4" />
            <div class="flex justify-end gap-3">
                <div class="w-24" v-if="props.id">
                    <LoadingBtn type="button" label="Cancel" variant="neutral" @click="cancel" />
                </div>
                <div class="w-24">
                    <LoadingBtn v-if="!props.id" type="submit" label="Save" loadingLabel="Saving..." :loading="loading" />
                    <LoadingBtn v-else type="submit" label="Update" loadingLabel="Updating..." :loading="loading" />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'
import StarRating from '../StarRating.vue';

const props = defineProps({
    id: {
        type: Number,
        default: null,
    },
    product_id: {
        type: Number,
        required: true
    },
});

const emits = defineEmits(['success', 'cancel'])

const review = ref('')
const rating = ref(null)
const loading = ref(false)

const submit = async () => {
    if (props.id) {
        await update()
    } else {
        await create()
    }
}

const create = async () => {
    if (!props.product_id) return;
    loading.value = true
    try {
        const payload = {
            review: review.value,
            rating: rating.value,
        }
        await useApi(`/products/${props.product_id}/reviews`, {
            method: 'POST',
            body: payload
        })
        toast.success('Review submitted successfully.')
        review.value = ''
        rating.value = null
        emits('success')
    } catch (error) {
        console.log(error)
        toast.error('Failed to submit review.')
    } finally {
        loading.value = false
    }
}

const update = async () => {
    if (!props.product_id) return;
    if (!props.id) return;
    loading.value = true
    try {
        const payload = {
            review: review.value,
            rating: rating.value,
        }
        await useApi(`/products/${props.product_id}/reviews/${props.id}`, {
            method: 'PUT',
            body: payload
        })
        toast.success('Review updated successfully.')
        review.value = ''
        rating.value = null
        emits('success')
    } catch (error) {
        console.log(error)
        toast.error('Failed to submit review.')
    } finally {
        loading.value = false
    }
}

const cancel = () => {
    review.value = ''
    rating.value = null
    emits('cancel')
}

const fetchData = async () => {
    if (!props.id) return;
    try {
        const response = await useApi(`/products/${props.product_id}/reviews/${props.id}`, {
            method: 'GET',
        })
        // console.log(response)
        review.value = response.review.review
        rating.value = response.review.rating
    } catch (error) {
        // console.log(error)
        toast.error('Failed to load review data.')
    }
}

onMounted(() => {
    fetchData()
})
</script>