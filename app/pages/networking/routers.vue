<template>
    <PageBanner label="Routers" />
    <ProductsCustomerView :filter="{ category_id: 17 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Networking' },
    { label: 'Routers' },
]
</script>