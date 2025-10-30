<template>
    <PageBanner label="Earphones" />
    <ProductsCustomerView :filter="{ category_id: 10 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Accessories' },
    { label: 'Earphones' },
]
</script>