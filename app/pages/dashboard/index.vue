<template>
    <div class="p-6 bg-gray-50">
        <PageTitle label="Dashboard" />
        <Spinner v-if="loading" />
        <DataTable v-show="!loading" :data="data" :columns="columns" :totalItems="totalItems"
            :currentPage="currentPage" :pageSize="pageSize" addBtnLabel="Add"
            @update:currentPage="updateCurrentPage" @update:pageSize="updatePageSize" @add="router.push('/dashboard/products/create')"
            @view="" @edit="goToEditPage" @delete="confirmDeleteItem" :view="false">
            <SearchBox :columns="search_columns" v-model="search" @search="handleSearch" />
        </DataTable>
    </div>
</template>

<script setup>
import { toast } from 'vue-sonner'
import ImageCell from '~/components/Table/ImageCell.vue';

const totalItems = ref(4);
const currentPage = ref(1);
const pageSize = ref(10);

const data = ref([]);
const loading = ref(false);

const columns = [
    { accessorKey: 'product_image', header: 'Product', cell: ImageCell },
    { accessorKey: 'product_name', header: 'Name' },
    { accessorKey: 'price', header: 'Price (RM)' },
    { accessorKey: 'qty', header: 'Quantity' },
    // { accessorKey: 'description', header: 'Description' },
    { accessorKey: 'is_popular', header: 'Popularity' },
    { accessorKey: 'discount_type', header: 'Discount Type' },
    { accessorKey: 'discount_amount', header: 'Discount Amount' },
    { accessorKey: 'created_by', header: 'Created By' },
]

const search = ref('');
const search_columns = [
    { field: 'product_name', header: 'Name' },
    { field: 'price_range', header: 'Price', type: 'price_range' },
]

const router = useRouter()

const updateCurrentPage = (page) => {
    currentPage.value = page;
    fetchData();
}

const updatePageSize = (size) => {
    pageSize.value = size;
    fetchData();
}

const searchColumn = ref('');
const searchValue = ref('');
const handleSearch = (query) => {
    searchColumn.value = query.column;
    searchValue.value = query.search;
    fetchData();
}

const fetchData = async () => {
    loading.value = true
    try {
        let params = {
            perPage: pageSize.value,
            page: currentPage.value,
        }
        if (searchColumn.value && searchValue.value) {
            params[searchColumn.value] = searchValue.value;
        }
        const response = await useApi('/products', {
            params: params
        });
        data.value = response.products.data.map((item) => ({
            id: item.id,
            images: item.images,
            product_image: item.images && item.images.length > 0 ? item.images[0] : null,
            product_name: item.product_name,
            price: item.price,
            qty: item.qty,
            description: item.description,
            is_popular: item.is_popular ? 'Yes' : 'No',
            discount_type: item.discount_type,
            discount_amount: item.discount_amount,
            created_by: item.created_by_user?.name || '',
        }))
        totalItems.value = response.products.total
        // console.log(response)
    } catch (error) {
        console.log(error)
        toast.error('Failed to load products.')
    } finally {
        loading.value = false;
    }
}

onMounted(() => {
    fetchData();
})

function goToEditPage(data) {
    router.push(`/dashboard/products/edit/${data.id}`);
}

const confirmDeleteItem = (data) => {
    if (confirm(`Are you sure you want to delete: ${data.product_name}?`)) {
        deleteItem(data.id)
    }
};

const deleteItem = async (id) => {
    loading.value = true
    try {
        await useApi(`/products/${id}`, {
            method: 'DELETE',
        })
        toast.success('Product Successfully Deleted!')
        fetchData();
    } catch (error) {
        console.log(error)
        toast.error('Failed to delete product. Please try again.')
    } finally {
        loading.value = false;
    }
}
</script>