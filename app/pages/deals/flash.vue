<template>
    <PageBanner label="Flash Deals" />
    <ProductsCustomerView :filter="{ on_sale: true }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Deals' },
    { label: 'Flash Deals' },
]
</script>