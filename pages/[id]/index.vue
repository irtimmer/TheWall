<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div id="wall" v-if="data">
    <View v-for="view in views" :view="view" :key="view.id" />
    <p id="copyright-notice" class="fixed bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded text-base">
      TheWall - &copy; 2024 Iwan Timmer
    </p>
  </div>
  <div @click="openFullscreen" class="fixed cursor-pointer inset-0 flex flex-col items-center justify-center bg-black bg-opacity-75" v-if="!windowed">
    <p class="text-white">Open in fullscreen</p>
    <a @click.stop="windowed = true" class="text-blue-800">or use windowed</a>
  </div>
</template>

<style>
#wall {
  cursor: none;
  background-color: black;
  width: 100vw;
  height: 100vh;
}
</style>

<script setup lang="ts">
import { useEventSource } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const data = ref({"views": []})
const windowed = ref(false)

if (import.meta.client && window.wallRendererInit)
  window.wallRendererInit()

const id = route.params.id
const { data: d } = useEventSource(`/api/events?id=${id}`)
watch(d, d => {
  if (!d) return

  const event = JSON.parse(d)
  if (event.action === 'setup')
    data.value = event.data
})

function flattenViews(views: View[], parent?: View): View[] {
  return views.flatMap(view => {
    if (parent) {
      view.top = parent.top + (view.top * parent.height) / 100
      view.left = parent.left + (view.left * parent.width) / 100
      view.width = (view.width * parent.width) / 100
      view.height = (view.height * parent.height) / 100
    }
    if (view.type === 'layout')
      return flattenViews(view.views, view)
    else
      return [view]
  })
}

const views = computed(() => flattenViews(data.value.views))

function openFullscreen() {
  document.getElementById("wall")?.requestFullscreen()
}
</script>
