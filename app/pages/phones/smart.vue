<template>
    <PageBanner label="Smart Phones" />
    <ProductsCustomerView :filter="{ category_id: 6 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Mobile Phones' },
    { label: 'Smart Phones' },
]
</script>