<template>
    <PageBanner label="Best Sellers" />
    <ProductsCustomerView :filter="{ is_popular: 1 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Shop' },
    { label: 'Best Sellers' },
]
</script>