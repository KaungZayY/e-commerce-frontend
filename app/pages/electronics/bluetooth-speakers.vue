<template>
    <PageBanner label="Bluetooth Speakers" />
    <ProductsCustomerView :filter="{ category_id: 15 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Electronics' },
    { label: 'Bluetooth Speakers' },
]
</script>