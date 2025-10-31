<template>
    <div class="flex flex-col gap-2">
        <label v-if="label" class="text-sm font-medium text-gray-700">
            {{ label }}
        </label>
        <div class="flex gap-1">
            <button v-for="star in 5" :key="star" type="button" @click="setRating(star)"
                @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                class="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-1 rounded"
                :aria-label="`Rate ${star} out of 5 stars`">
                <svg xmlns="http://www.w3.org/2000/svg" :class="[
                    'w-8 h-8 transition-colors',
                    (hoverRating >= star || (!hoverRating && modelValue >= star))
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-none text-gray-300'
                ]" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            </button>
        </div>
        <div class="text-sm text-gray-600">
            {{ modelValue > 0 ? `${modelValue} out of 5 stars` : 'No rating' }}
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: Number,
        default: 0,
        validator: (value) => value >= 0 && value <= 5
    },
    label: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:modelValue']);

const hoverRating = ref(0);

const setRating = (rating) => {
    emit('update:modelValue', rating);
};
</script>