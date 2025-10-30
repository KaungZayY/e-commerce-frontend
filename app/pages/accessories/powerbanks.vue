<template>
    <PageBanner label="Earphones" />
    <ProductsCustomerView :filter="{ category_id: 12 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Accessories' },
    { label: 'Powerbanks' },
]
</script>