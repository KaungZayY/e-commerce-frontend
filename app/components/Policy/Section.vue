<template>
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <!-- Section Title -->
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            {{ title }}
        </h2>

        <!-- Optional Description (before list) -->
        <p v-if="description" class="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed" v-html="description"></p>

        <!-- Main List -->
        <component v-if="items && items.length" :is="listTag" :class="[
            listTag === 'ol' ? 'list-decimal ml-6' : 'list-disc ml-6',
            'space-y-3 text-sm sm:text-base text-gray-700'
        ]">
            <li v-for="(item, index) in items" :key="index" class="leading-relaxed">
                <!-- Label / Subtitle -->
                <template v-if="item.label">
                    <span class="font-semibold text-gray-900">{{ item.label }}</span>
                </template>

                <!-- Inline text -->
                <span v-if="item.text" class="block" v-html="item.text"></span>

                <!-- Nested Subitems -->
                <ul v-if="item.subItems" class="list-disc ml-6 mt-2 space-y-1">
                    <li v-for="(sub, i) in item.subItems" :key="i" v-html="sub"></li>
                </ul>
            </li>
        </component>

        <!-- Optional Footer Paragraph -->
        <p v-if="footer" class="text-sm sm:text-base text-gray-700 mt-4 leading-relaxed" v-html="footer"></p>

        <!-- Optional Extra Section -->
        <div v-if="extraSection" class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-base sm:text-lg font-bold text-gray-900 mb-3">
                {{ extraSection.title }}
            </h3>
            <ul class="list-disc ml-6 space-y-2 text-sm sm:text-base text-gray-700">
                <li v-for="(sub, idx) in extraSection.items" :key="idx" v-html="sub"></li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    title: String,
    description: String, // text before list
    items: {
        type: Array,
        required: false,
        default: () => []
    },
    footer: String, // ✅ text after list
    extraSection: Object,
    listType: {
        type: String,
        default: 'bullet', // 'bullet' | 'number'
        validator: (v) => ['bullet', 'number'].includes(v)
    }
})

// dynamic tag (ul or ol)
const listTag = computed(() => (props.listType === 'number' ? 'ol' : 'ul'))
</script>
