<template>
  <div class="h-screen overflow-hidden">
    <div ref="container" id="views" class="h-screen bg-gray-100">
      <Placeholder v-if="data" v-for="view in data.views" @click="activeView = view" :view="view" :container="containerDescr" :active="view == activeView"/>
      <button @click="addView()" class="absolute bottom-0 right-0 mb-4 mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">+</button>
    </div>

    <Sidebar v-model:visible="activeView" position="right">
      <Editor v-if="activeView" :webrtc="webrtc" :view="activeView"/>
    </Sidebar>
</div>
</template>

<style>
@import url("~/assets/css/base.css");

#views {
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
