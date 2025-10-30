<template>
    <PageBanner label="Smart Watches" />
    <ProductsCustomerView :filter="{ category_id: 13 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Electronics' },
    { label: 'Smart Watches' },
]
</script>