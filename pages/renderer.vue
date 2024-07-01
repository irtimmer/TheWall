<template>
  <div id="wall" v-if="data">
    <View v-for="view in data.views" :view="view" />
  </div>
  <div @click="openFullscreen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75" v-if="data">
    <p class="text-white" @click="openFullscreen">Open in fullscreen</p>
  </div>
</template>

<style>
#wall {
  cursor: none;
}
</style>

<script setup lang="ts">
import { useEventSource } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const data = ref([])

if (import.meta.client)
  window.wallRenderer()

const id = route.query.id
const { data: d } = useEventSource(`/api/events?id=${id}`)
watch(d, d => {
  if (!d) return

  const event = JSON.parse(d)
  if (event.action === 'setup')
    data.value = event.data
})

function openFullscreen() {
  document.getElementById("wall")?.requestFullscreen()
}
</script>
