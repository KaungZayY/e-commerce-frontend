<template>
    <PageBanner label="Earphones" />
    <ProductsCustomerView :filter="{ category_id: 11 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Accessories' },
    { label: 'Cases' },
]
</script>