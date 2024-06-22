<template>
  <div class="relative mt-6 flex-1 px-4 sm:px-6">
    <button @click="view.type = 'iframe'" class="px-4 py-2 mr-2 text-white rounded" :class="view.type === 'iframe' ? 'bg-blue-500' : 'bg-gray-500'">Web</button>
    <button @click="view.type = 'img'" class="px-4 py-2 m-2 text-white rounded" :class="view.type === 'img' ? 'bg-blue-500' : 'bg-gray-500'">Image</button>
    <button @click="view.type = 'video'" class="px-4 py-2 m-2 text-white rounded" :class="view.type === 'video' ? 'bg-blue-500' : 'bg-gray-500'">Video</button>
    <input type="text" v-model="view.url" class="w-full border border-gray-300 p-2 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  view: View
}>()
</script>
