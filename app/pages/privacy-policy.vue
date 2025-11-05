<template>
    <PageBanner :label="title" :breadcrumbItems="breadcrumbItems"/>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <!-- Header -->
            <PolicyHeader :title="title" :time="time" :description="description" />

            <!-- Section 1 -->
            <PolicySection :title="section1.title" :description="section1.description" :items="section1.items" />

            <!-- Section 2 -->
            <PolicySection :title="section2.title" :description="section2.description" :items="section2.items" />

            <!-- Section 3 -->
            <PolicySection :title="section3.title" :description="section3.description" :items="section3.items"
                :footer="section3.footer" />

            <!-- Section 4 -->
            <PolicySection :title="section4.title" :description="section4.description" :items="section4.items" />

            <!-- Section 5 -->
            <PolicySection :title="section5.title" :description="section5.description" :items="section5.items"
                :footer="section5.footer" />

            <!-- Section 6 -->
            <PolicySection :title="section6.title" :description="section6.description" :items="section6.items"
                :footer="section6.footer" />

            <!-- Section 7 -->
            <PolicySection :title="section7.title" :description="section7.description" />

            <!-- Section 8 -->
            <PolicySection :title="section8.title" :description="section8.description" />
        </div>
    </div>
</template>

<script setup lang="ts">

const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Privacy Policy' },
]

const title = ref<string>('Privacy Policy')
const time = ref<string>('2025-08-02')

const description = ref<string>(`At Tech Gadgets (“we,” “us,” “our”), we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website <strong>www.techgadgets.deals</strong> or make a purchase from us.
<br><br>
By using our website, you consent to the practices described in this policy. If you do not agree, please do not use our services.`)

const section1 = {
    title: '1. Information We Collect',
    description: 'We may collect the following types of information:',
    items: [
        {
            label: 'Personal Information',
            subItems: [
                'Name',
                'Email address',
                'Shipping/billing address',
                'Phone number',
                'Payment details (processed securely via third-party providers like Stripe, PayPal, etc.)',
                'Account login credentials (if you create an account)'
            ]
        },
        {
            label: 'Non-Personal Information',
            subItems: [
                'Browser type & IP address',
                'Cookies & tracking data <strong>(see Section 5: Cookies & Tracking Technologies)</strong>',
                'Purchase history & preferences'
            ]
        }
    ]
}

const section2 = {
    title: '2. How We Use Your Information',
    description: 'We use your data for the following purposes:',
    items: [
        { text: 'To process and fulfill your orders' },
        { text: 'To communicate with you (order confirmations, shipping updates, customer support)' },
        { text: 'To improve our website, products, and services' },
        { text: 'To prevent fraud and enhance security' },
        { text: 'For marketing (with your consent, where required by law)' },
        { text: 'To comply with legal obligations' }
    ]
}

const section3 = {
    title: '3. How We Share Your Information',
    description: 'We do not sell your personal data. However, we may share it with:',
    items: [
        { text: '<strong>Payment processors</strong> (to complete transactions)' },
        { text: '<strong>Shipping carriers</strong> (to deliver orders)' },
        { text: '<strong>Service providers</strong> (e.g., email marketing tools, analytics)' },
        { text: '<strong>Legal authorities</strong> (if required by law)' }
    ],
    footer: 'All third parties must comply with data protection laws.'
}

const section4 = {
    title: '4. Data Retention & Security',
    description:
        'We retain your data only as long as necessary for business, legal, or tax purposes.',
    items: [
        {
            text: 'We implement security measures (SSL encryption, secure payment gateways) to protect your data. However, no online system is 100% secure.'
        }
    ]
}

const section5 = {
    title: '5. Cookies & Tracking Technologies',
    description: 'We use cookies to:',
    items: [
        { text: 'Enhance user experience' },
        { text: 'Analyze website traffic' },
        { text: 'Remember cart items & preferences' }
    ],
    footer:
        'You can disable cookies in your browser settings, but some website features may not function properly.'
}

const section6 = {
    title: '6. Your Rights (GDPR/CCPA Compliance)',
    description: 'Depending on your location, you may have the right to:',
    items: [
        { text: 'Access, correct, or delete your personal data' },
        { text: 'Opt out of marketing communications' },
        { text: 'Restrict or object to data processing' },
        { text: 'Request a copy of your data' }
    ],
    footer: 'To exercise these rights, contact us at <span class="font-medium text-gray-800">support@techgadgets.deals</span>.'
}

const section7 = {
    title: '7. Third-Party Links',
    description:
        'Our website may contain links to third-party sites (e.g., social media, payment gateways). We are not responsible for their privacy practices.'
}

const section8 = {
    title: '8. Children’s Privacy',
    description:
        'Our services are not intended for users under <strong>18</strong>. We do not knowingly collect data from children.'
}
</script>
