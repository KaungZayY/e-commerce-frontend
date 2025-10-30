<template>
    <PageBanner label="Chargers" />
    <ProductsCustomerView :filter="{ category_id: 9 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Accessories' },
    { label: 'Chargers' },
]
</script>