<template>
    <PageBanner label="Telecom & Mobile Devices" />
    <ProductsCustomerView :filter="{ category_id: 21 }" :breadcrumbItems="breadcrumbItems"/>
</template>

<script setup>
const breadcrumbItems = [
    { label: 'Wholesale' },
    { label: 'Telecom & Mobile Devices' },
]
</script>