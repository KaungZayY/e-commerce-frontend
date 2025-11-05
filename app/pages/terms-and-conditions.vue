<template>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <!-- Header -->
            <PolicyHeader :title="title" :time="time" :description="description" />

            <!-- Sections -->
            <PolicySection title="1. General Terms" :items="generalTerms" />
            <PolicySection title="2. Account Registration" :items="accountRegistration" />
            <PolicySection title="3. Orders & Payments" :items="ordersPayments" />
            <PolicySection title="4. Shipping & Delivery" :items="shippingDelivery" />
            <PolicySection title="5. Returns & Refunds" :items="returnsRefunds" />
            <PolicySection title="6. Intellectual Property" :items="intellectualProperty" />
            <PolicySection title="7. Limitation of Liability" :items="limitationLiability" />
            <PolicySection title="8. Privacy Policy" :items="privacyPolicy" />
            <PolicySection title="9. Governing Law" :items="governingLaw" />
            <PolicySection title="10. Changes to Terms" :items="changesToTerms" />
        </div>
    </div>
</template>

<script setup lang="ts">
const title = ref<string>('Terms and Conditions');
const description = ref<string>(`Welcome to Tech Gadgets (“we,” “us,” “our”). These Terms and Conditions (“Terms”) govern your use of our website <strong>www.techgadgets.deals</strong> and any related services, including purchases, account registration, and customer support. By accessing or using our website, you agree to comply with these Terms. If you do not agree, please do not use our services.`);
const time = ref<string>('2025-08-02');

const generalTerms = [
    { text: 'You must be at least <strong>18 years old</strong> (or the legal age in your jurisdiction) to make a purchase.' },
    { text: 'All purchases are subject to <strong>product availability</strong>.' },
    { text: 'We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion.' }
];

const accountRegistration = [
    { text: 'You are responsible for maintaining the confidentiality of your login details.' },
    { text: 'Notify us immediately of any unauthorized account activity.' }
];

const ordersPayments = [
    { text: 'All prices are listed in <strong>MYR</strong> and are subject to change without notice.' },
    { text: 'We accept <strong>FPX</strong> and <strong>eWallet</strong> only.' },
    { text: 'Orders are processed only after payment confirmation.' },
    { text: 'If an item is out of stock, we will notify you and issue a refund if applicable.' }
];

const shippingDelivery = [
    { text: 'Shipping costs and delivery times vary based on location and carrier.' },
    { text: 'Risk of loss transfers to you upon delivery.' },
    { text: 'Delays due to unforeseen circumstances (e.g., weather, customs) are not our responsibility.' },
    {
        label: 'Processing Time',
        subItems: [
            'Orders are typically processed within <strong>2 business days</strong> (excluding weekends and holidays).',
            'During peak seasons or promotions, processing may take slightly longer.'
        ]
    },
    {
        label: 'Estimated Delivery Times',
        subItems: [
            '1 – 3 business days',
            'Delivery times are estimates and not guaranteed.'
        ]
    }
];

const returnsRefunds = [
    { text: 'Our return policy is <strong>30 days</strong> from the delivery date.' },
    { text: 'Items must be unused, in original packaging, and with proof of purchase.' },
    { text: 'Refunds will be processed to the original payment method within <strong>30 business days</strong>.' },
    { text: 'Shipping costs for returns are the customer’s responsibility unless the return is due to our error.' }
];

const intellectualProperty = [
    { text: 'All content on our website (logos, text, images) is our property and protected by copyright laws.' },
    { text: 'Unauthorized use, reproduction, or distribution is prohibited.' }
];

const limitationLiability = [
    { text: 'We are not liable for any indirect, incidental, or consequential damages arising from your use of our website.' },
    { text: 'Our total liability for any claim related to our services is limited to the purchase price of the product in question.' }
];

const privacyPolicy = [
    { text: 'Your personal data is handled in accordance with our <strong>Privacy Policy</strong>, which is incorporated into these Terms.' }
];

const governingLaw = [
    { text: 'These Terms are governed by the laws of <strong>Malaysia</strong>, and any disputes will be resolved in its courts.' }
];

const changesToTerms = [
    { text: 'We may update these Terms at any time. Continued use of our website constitutes acceptance of the revised Terms.' }
];
</script>
