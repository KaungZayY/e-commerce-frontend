<template>
    <PageBanner label="Modems" />
    <ProductsCustomerView :filter="{ category_id: 20 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Networking' },
    { label: 'Modems' },
]
</script>