<template>
    <PageBanner label="Refurbished Phones" />
    <ProductsCustomerView :filter="{ category_id: 8 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Mobile Phones' },
    { label: 'Refurbished Phones' },
]
</script>