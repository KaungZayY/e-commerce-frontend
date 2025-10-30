<template>
    <PageBanner label="New Arrivals" />
    <ProductsCustomerView :filter="{ sort: 'created_at_desc' }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Shop' },
    { label: 'New Arrivals' },
]
</script>