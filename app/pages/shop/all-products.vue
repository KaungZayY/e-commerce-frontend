<template>
    <PageBanner label="All Products" />
    <ProductsCustomerView :breadcrumbItems="breadcrumbItems"/>
</template>


<script setup>
const breadcrumbItems = [
    { label: 'Shop' },
    { label: 'All Products' },
]
</script>