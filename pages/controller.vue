<template>
  <div class="flex h-screen overflow-hidden">
    <div ref="container" class="container flex bg-gray-100">
      <Placeholder v-if="data" v-for="view in data.views" @click="activeView = view" :view="view" :container="containerDescr" :active="view == activeView"/>
      <button @click="addView()" class="absolute bottom-0 right-0 mb-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">+</button>
    </div>

    <div class="pointer-events-auto relative w-screen max-w-sm">
      <div v-if="activeView" class="relative mt-6 flex-1 px-4 sm:px-6">
        <input type="text" v-model="activeView.url" class="w-full border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500" />
      </div>
    </div>
</div>
</template>

<style scoped>
.container {
  container-type: inline-size;
}
</style>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core'
import { useRoute } from 'vue-router'

const container = ref(null)
const containerDescr = ref({
  width: 0,
  height: 0
})

useResizeObserver(container, (entries) => {
  const { width, height } = entries[0].contentRect
  containerDescr.value = {
    width, height
  }
})

const route = useRoute()
const id = route.query.id
const { data } = await useFetch(`/api/state?id=${id}`)
const activeView = ref(null)

watch(data, data => {
  useFetch(`/api/event?id=${id}`, {
    method: 'POST',
    body: JSON.stringify({
      "action": "setup",
      data
    }),
  })
}, { immediate: true, deep: true })

function addView() {
  data.value?.views.push({
    url: 'about:blank',
    top: 10,
    left: 10,
    height: 25,
    width: 25
  })
}
</script>
