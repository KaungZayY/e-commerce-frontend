<template>
    <PageBanner label="Feature Phones" />
    <ProductsCustomerView :filter="{ category_id: 7 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Mobile Phones' },
    { label: 'Feature Phones' },
]
</script>