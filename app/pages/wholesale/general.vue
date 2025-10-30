<template>
    <PageBanner label="General Wholesale" />
    <ProductsCustomerView :filter="{ category_id: 22 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Wholesale' },
    { label: 'General Wholesale' },
]
</script>