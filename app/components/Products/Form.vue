<template>
    <div class="min-h-screen bg-gray-50 flex items-center justify-center p-3 sm:p-6">
        <div class="w-full max-w-3xl bg-white p-4 sm:p-6 rounded shadow">
            <div class="relative mb-4 sm:mb-6 flex items-center justify-center">
                <LoadingBtn icon="arrow-left" variant="neutral" type="button" class="absolute left-0 w-auto"
                    @click="goBack" />
                <PageTitle v-if="!props.id" label="Add New Product" />
                <PageTitle v-else-if="props.id" label="Update Product" />
            </div>

            <Spinner v-if="spinner" />
            <form v-else @submit.prevent="submit" class="space-y-3 sm:space-y-4">
                <div class="flex flex-col sm:flex-row gap-3">
                    <Textbox id="product_name" label="Product Name" placeholder="Mobile Phone" v-model="product_name"
                        :required="true" :error="errors.product_name ? errors.product_name[0] : ''" />
                    <Textbox id="price" :label="priceLabel" type="number" placeholder="" v-model="price"
                        :required="true" :error="errors.price ? errors.price[0] : ''" />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <Textbox id="qty" label="Quantity" type="number" placeholder="" v-model="qty" :required="true"
                        :error="errors.qty ? errors.qty[0] : ''" />
                    <CheckBox id="is_popular" label="Popular Product" v-model="is_popular"
                        :error="errors.is_popular ? errors.is_popular[0] : ''" />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <SelectBox v-model="discount_type" :dataOptions="currency_statuses" label="Discount "
                        id="discount_type" placeholder="Select Discount Type"
                        :error="errors.discount_type ? errors.discount_type[0] : ''" />
                    <Textbox id="discount_amount" label="Discount Amount" type="number" placeholder=""
                        v-model="discount_amount"
                        :unit="discount_type === 'percentage' ? '%' : discount_type === 'amount' ? 'RM' : null"
                        :error="errors.discount_amount ? errors.discount_amount[0] : ''" />
                </div>
                <div class="flex flex-col sm:flex-row gap-3">
                    <SelectBox v-model="parent_category_id" :dataOptions="categories" label="Category"
                        id="parent_category_id" placeholder="Select Category" optionLabel="category_name"
                        optionValue="id" :error="errors.parent_category_id ? errors.parent_category_id[0] : ''" />
                    <SelectBox v-model="category_id" :dataOptions="sub_categories" label="Sub Category"
                        optionLabel="category_name" optionValue="id" id="category_id" placeholder="Select Sub Category"
                        :required="true" :error="errors.category_id ? errors.category_id[0] : ''" />
                </div>
                <div v-if="category_id == 21 || category_id == 22">
                    <Textbox id="moq" label="Minimum Order Quantity (MOQ)" type="number" v-model="moq"
                        :error="errors.moq ? errors.moq[0] : ''" />
                </div>
                <div>
                    <FileUpload id="images" label="Product Images" v-model="images" mode="multiple"
                        :valid-types="['PNG', 'JPEG', 'WEBP']" :max-size="10" dir="product_images"
                        :error="errors.images ? errors.images[0] : ''" />
                </div>
                <div>
                    <RichTextEditor v-model="description" label="Product Description" id="description"
                        placeholder="Describe your product here..." :rows="6"
                        :error="errors.description ? errors.description[0] : ''" />
                </div>

                <div class="w-full flex justify-end pt-2">
                    <div class="w-full sm:w-auto sm:min-w-[120px]">
                        <LoadingBtn v-if="!props.id" :label="'Add'" :loading-label="'Adding...'" :loading="loading"
                            type="submit" />
                        <LoadingBtn v-else :label="'Update'" :loading-label="'Updating...'" :loading="loading"
                            type="submit" />
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

const router = useRouter();
const errors = ref({});
const loading = ref(false);
const spinner = ref(false);

const goBack = () => {
    router.push('/dashboard');
};

const props = defineProps({
    id: {
        type: Number,
        required: false,
        default: null
    }
})

const product_name = ref('');
const price = ref('');
const qty = ref('');
const is_popular = ref(0);
const images = ref([]);
const description = ref('');
const discount_type = ref('amount');
const discount_amount = ref(0);
const parent_category_id = ref(null)
const category_id = ref(null)
const moq = ref('')

const priceLabel = computed(() => {
    return category_id.value == 21 || category_id.value == 22
        ? 'Bulk Price (RM) Per Unit'
        : 'Price (RM)'
})

const currency_statuses = [
    { label: 'By Percentage (%)', value: 'percentage' },
    { label: 'By Ringgit (RM)', value: 'amount' },
]

const categories = await useApiData('/options/categories');
const sub_categories = ref([]);

watch(parent_category_id, async (id) => {
    if (id) {
        sub_categories.value = await useApiData(`/options/sub-categories/${id}`)
    } else {
        sub_categories.value = []
    }
})

const submit = () => {
    if (props.id) {
        update();
    } else {
        create();
    }
}

const create = async () => {
    loading.value = true
    errors.value = {}
    const payload = {
        product_name: product_name.value,
        price: price.value,
        qty: qty.value,
        is_popular: is_popular.value,
        images: images.value,
        description: description.value,
        discount_type: discount_type.value,
        discount_amount: discount_amount.value,
        category_id: category_id.value,
        moq: moq.value,
    }
    try {
        const response = await useApi('/products', {
            method: 'POST',
            body: payload,
        })
        toast.success('Product Successfully Added!')
        router.push('/dashboard');
    } catch (error) {
        if (error.statusCode === 422 && error.data?.errors) {
            errors.value = error.data.errors;
            toast.error('Please fix the validation errors.')
        } else {
            toast.error('Action failed. Please try again.')
        }
    } finally {
        loading.value = false;
    }
}

const update = async () => {
    if (!props.id) return;
    loading.value = true
    errors.value = {}
    const payload = {
        product_name: product_name.value,
        price: price.value,
        qty: qty.value,
        is_popular: is_popular.value,
        images: images.value,
        description: description.value,
        discount_type: discount_type.value,
        discount_amount: discount_amount.value,
        category_id: category_id.value,
        moq: moq.value,
    }
    try {
        const response = await useApi(`/products/${props.id}`, {
            method: 'PUT',
            body: payload,
        })
        toast.success('Product Successfully Updated!')
        router.push('/dashboard');
    } catch (error) {
        if (error.statusCode === 422 && error.data?.errors) {
            errors.value = error.data.errors;
            toast.error('Please fix the validation errors.')
        } else {
            toast.error('Action failed. Please try again.')
        }
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    if (props.id) {
        fetchData()
    }
})

const fetchData = async () => {
    if (!props.id) return;
    spinner.value = true;
    try {
        const response = await useApi(`/products/${props.id}`);
        // console.log(response)
        product_name.value = response.product?.product_name || '';
        price.value = response.product?.price || '';
        qty.value = response.product?.qty || '';
        is_popular.value = response.product.is_popular ? 1 : 0;
        description.value = response.product?.description || '';
        discount_type.value = response.product?.discount_type || '';
        discount_amount.value = response.product?.discount_amount || '';
        category_id.value = response.product?.category_id || '';
        parent_category_id.value = response.product.category?.parent_id || '';
        moq.value = response.product?.moq || '';
        images.value = response.product.images || [];
    } catch (error) {
        // console.log(error)
        toast.error('Failed to load product data.')
    } finally {
        spinner.value = false
    }
}
</script>
