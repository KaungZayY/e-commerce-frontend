<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <!-- Header -->
            <PolicyHeader :title="title" time="2025-08-02"
                :description="description" />

            <!-- Section 1 -->
            <PolicySection title="1. Eligibility for Returns & Refunds" :items="section1Items">
                <template #after>
                    <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3 mt-6 pt-6 border-t border-gray-200">
                        Non-Returnable Items (if applicable)
                    </h3>
                    <ul class="list-disc ml-6 space-y-2 text-sm sm:text-base text-gray-700">
                        <li v-for="(item, i) in nonReturnableItems" :key="i" v-html="item" />
                    </ul>
                </template>
            </PolicySection>

            <!-- Section 2 -->
            <PolicySection title="2. How to Initiate a Return" :items="section2Items" listType="number" />

            <!-- Section 3 -->
            <PolicySection title="3. Refund Process" :items="section3Items" />

            <!-- Section 4 -->
            <PolicySection title="4. Exchanges" :items="section4Items.map(text => ({ text }))" />

            <!-- Section 5 -->
            <PolicySection title="5. Defective or Damaged Products" :items="section5Items.map(text => ({ text }))" />

            <!-- Section 6 -->
            <PolicySection title="6. Warranty Claims" :items="section6Items.map(text => ({ text }))" />

            <!-- Section 7 -->
            <PolicySection title="7. Cancellations" :items="section7Items.map(text => ({ text }))" />
        </div>
    </div>
</template>

<script setup lang="ts">

const title = ref<string>('Refund & Returns Policy');
const description = ref<string>(`At <strong>Tech Gadgets</strong>, we want you to be completely satisfied with your purchase. If you're not happy with an electronic product you've bought from us, this policy outlines the conditions under which you can return or exchange it.`);

interface PolicyItem {
    label?: string
    text?: string
    subItems?: string[]
}

const section1Items: PolicyItem[] = [
    {
        label: 'Return Window',
        text: 'You have <strong>14 days</strong> from the delivery date to request a return.'
    },
    {
        label: 'Condition of Product',
        subItems: [
            'Must be <strong>unused</strong>, in <span class="font-semibold">original packaging</span>, and include all accessories/manuals.',
            'Must show no signs of damage, wear, or tampering.'
        ]
    },
    {
        label: 'Proof of Purchase',
        text: 'A valid order number or <span class="font-semibold">receipt</span> is required.'
    }
]

const nonReturnableItems = [
    'Opened software, digital downloads, or personalized/customized electronics.',
    'Products damaged due to misuse or improper handling.'
]

const section2Items: PolicyItem[] = [
    {
        text: '<strong>Contact Us</strong> within the return window at <span class="font-medium text-gray-800">support@techgadgets.deals</span> with your order number and reason for return.'
    },
    {
        text: "<strong>Wait for Approval</strong> – We'll review your request and provide return instructions."
    },
    {
        text: '<strong>Ship the Item Back</strong> – Pack it securely and include all original components.'
    },
    {
        text: '<strong>Refund/Exchange Processed</strong> – Once we receive and inspect the item, we\'ll proceed with your refund or replacement.'
    }
]

const section3Items: PolicyItem[] = [
    {
        label: 'Approved Returns',
        text: 'Refunds will be issued to the original payment method within <strong>3 business days</strong> after we receive the item.'
    },
    {
        label: 'Shipping Costs',
        text: 'Return shipping is the customer’s responsibility unless the return is due to our error (e.g., wrong or defective item).'
    }
]

const section4Items = [
    'If you need a replacement (e.g., wrong size, color, defective product), we’ll ship a new item once the original is returned.',
    'Exchanges are subject to product availability.'
]

const section5Items = [
    'If your electronic item arrives defective or damaged, contact us within <strong>3 days</strong> for a free return/replacement.',
    'Provide photos/video proof if requested.'
]

const section6Items = [
    "Some electronics come with a manufacturer's warranty. Contact us for assistance with warranty claims."
]

const section7Items = [
    'Orders can be canceled within <strong>12 hours</strong> of placement if not yet shipped.'
]
</script>