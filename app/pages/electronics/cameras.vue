<template>
    <PageBanner label="Cameras" />
    <ProductsCustomerView :filter="{ category_id: 16 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Electronics' },
    { label: 'Cameras' },
]
</script>