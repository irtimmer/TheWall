<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div id="wall" v-if="data">
    <TransitionGroup name="fade">
      <div v-for="view in views" :key="view.id">
        <Container :view="view" />
      </div>
    </TransitionGroup>
    <p id="copyright-notice" class="fixed bottom-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded text-base">
      TheWall - &copy; 2024 Iwan Timmer
    </p>
  </div>
</template>

<style>
@import url("~/assets/css/transitions.css");
@import url("~/assets/css/effects.css");

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

onMounted(() => {
  document.getElementById("wall")?.requestFullscreen()
})
</script>
