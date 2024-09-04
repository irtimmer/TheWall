<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div ref="container" class="layout">
    <template v-for="view in data.views">
      <Placeholder @click.stop="active = view" @close="removeView(view)" :active="view === active" :view="view" :container="containerDescr" />
    </template>
    <div class="absolute bottom-0 left-0 flex flex-col">
      <button v-if="data.type == 'root'" @click.stop="active = data" class="mb-4 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">C</button>
      <button @click.stop="addView()" class="mb-4 ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">+</button>
    </div>
  </div>
</template>

<style scoped>
.layout {
  container-type: size;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';

const active = defineModel<View>("active")
const props = defineProps<{
  data: {
    type: "layout" | "root"
    views: View[]
    constraints: {
      width: number
      height: number
    }
  }
}>()

const container = ref(null)
const containerDescr = ref({
  width: 0,
  height: 0,
  constraints: toRef(() => props.data.constraints)
})

useResizeObserver(container, (entries) => {
  const { width, height } = entries[0].contentRect
  containerDescr.value = {
    width, height,
    constraints: toRef(() => props.data.constraints)
  }
})

function addView() {
  if (!props.data.views)
    props.data.views = []

  props.data.views.push({
    type: 'iframe',
    url: 'about:blank',
    top: 10,
    left: 10,
    height: 25,
    width: 25
  })
}

function removeView(view) {
  const index = props.data.views.indexOf(view)
  props.data.views.splice(index, 1)
}
</script>