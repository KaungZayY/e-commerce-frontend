<template>
    <PageBanner label="Cables" />
    <ProductsCustomerView :filter="{ category_id: 19 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Networking' },
    { label: 'Cables' },
]
</script>