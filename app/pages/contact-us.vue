<template>
    <MapIframe :lat="lat" :lng="lng" :zoom="15" :height="450"/>
    <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                <!-- Left Section - Contact Information -->
                <div class="space-y-8 order-1">
                    <!-- Office Address -->
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Office Address
                        </h2>
                        <p class="text-gray-700 font-semibold mb-2 text-sm sm:text-base">
                            DOLLAR COMMUNICATIONS SDN. BHD. (1628171X)
                        </p>
                        <p class="text-gray-600 leading-relaxed text-sm sm:text-base">
                            Universal Serviced Offices Sdn Bhd Level 7, Tower 7, Avenue 7, Menara Pernas The Horizon
                            59200 Bangsar South, Kuala Lumpur
                        </p>
                    </div>

                    <!-- Call Us -->
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Call Us
                        </h2>
                        <p class="text-gray-700 font-medium text-base sm:text-lg">
                            {{ company_phone }}
                        </p>
                    </div>

                    <!-- Email Us -->
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Email Us
                        </h2>
                        <p class="text-gray-700 font-medium text-base sm:text-lg">
                            {{ company_email }}
                        </p>
                    </div>

                    <!-- Open Time -->
                    <div>
                        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                            Open Time
                        </h2>
                        <div class="space-y-2 text-gray-700 text-sm sm:text-base">
                            <p>MONDAY – FRIDAY (9:00 am to 6:00 pm)</p>
                            <p>SATURDAY & SUNDAY & PH (10:00 am to 5:00 pm)</p>
                        </div>
                    </div>
                </div>

                <!-- Right Section - Contact Form -->
                <div class="order-2">
                    <div class="mb-6">
                        <p class="text-gray-400 text-xs sm:text-sm uppercase tracking-wide mb-2">
                            Information about us
                        </p>
                        <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                            CONTACT US FOR ANY QUESTIONS
                        </h1>
                    </div>

                    <form @submit.prevent="sendEmail" class="space-y-5">
                        <!-- Name and Email Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input v-model="formData.name" type="text" id="name" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                                    placeholder="John Doe" />
                            </div>
                            <div>
                                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                    Your Email *
                                </label>
                                <input v-model="formData.email" type="email" id="email" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                                    placeholder="john@example.com" />
                            </div>
                        </div>

                        <!-- Phone and Company Row -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input v-model="formData.phone" type="tel" id="phone" required
                                    class="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                                    placeholder="+60 11 1234 5678" />
                            </div>
                            <div>
                                <label for="company" class="block text-sm font-medium text-gray-700 mb-2">
                                    Company
                                </label>
                                <input v-model="formData.company" type="text" id="company"
                                    class="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                                    placeholder="Your company name" />
                            </div>
                        </div>

                        <!-- Subject -->
                        <div>
                            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">
                                Subject *
                            </label>
                            <input v-model="formData.subject" type="text" id="subject" required
                                class="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                                placeholder="How can we help you?" />
                        </div>

                        <!-- Message -->
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                                Your Message *
                            </label>
                            <textarea v-model="formData.message" id="message" required rows="6"
                                class="w-full px-4 py-3 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-sm"
                                placeholder="Tell us more about your question..."></textarea>
                        </div>

                        <!-- Submit Button -->
                        <button type="submit"
                            class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded transition-colors uppercase tracking-wide text-sm">
                            Ask a Question
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const company_email = 'support@techgadgets.deals'
const company_phone = '+6011 5576 4508'
const lat = 3.139
const lng = 101.6869

const formData = ref({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: ''
})

const sendEmail = () => {
    const company_email = 'support@techgadgets.deals'

    const emailBody = `
${formData.value.message}

-----------------------------
Name: ${formData.value.name}
Email: ${formData.value.email}
Phone: ${formData.value.phone}
${formData.value.company ? `Company: ${formData.value.company}` : ''}
`.trim()

    const mailtoLink = `mailto:${company_email}?subject=${encodeURIComponent(
        formData.value.subject
    )}&body=${encodeURIComponent(emailBody)}`

    window.location.href = mailtoLink
}

</script>
