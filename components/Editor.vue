<template>
  <div class="relative mt-6 flex-1 px-4 sm:px-6">
    <input type="text" v-model="view.url" class="w-full border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  view: View
}>()
</script>
