<template>
    <PageBanner label="Wi-Fi Devices" />
    <ProductsCustomerView :filter="{ category_id: 18 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Networking' },
    { label: 'Wi-Fi Devices' },
]
</script>