<template>
  <div>
    <button
      class="flex justify-between items-center px-3 py-2 rounded-md text-sm font-bold w-full focus:outline-none"
      :class="active ? 'text-blue-600' : 'text-black'"
      @click="$emit('toggle')"
    >
      {{ label }}
      <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" :d="open ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'" />
      </svg>
    </button>
    <div v-if="open" class="flex flex-col pl-4">
      <NuxtLink
        v-for="(item, idx) in items"
        :key="item.to"
        :to="item.to"
        :class="[
            isActive(item.to) ? 'text-blue-600' : 'text-black',
            'font-semibold block px-4 py-2 text-sm',
            idx < items.length - 1 ? 'border-b border-gray-200' : ''
        ]"
      >
        {{ item.label }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
const props = defineProps({
  label: String,
  active: Boolean,
  open: Boolean,
  items: Array,
});
const emit = defineEmits(['toggle']);
const route = useRoute();
const isActive = (to) => route.path === to;
</script>
