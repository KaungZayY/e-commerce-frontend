<template>
    <PageBanner label="Tablets" />
    <ProductsCustomerView :filter="{ category_id: 14 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Electronics' },
    { label: 'Tablets' },
]
</script>