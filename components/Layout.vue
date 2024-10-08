<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div ref="container" class="layout">
    <template v-for="view in data.views" :key="view.id">
      <Placeholder @close="removeView(view)" v-model:active="active" :view="view" :container="containerDescr" />
    </template>
    <div v-if="root" class="absolute bottom-0 left-0 flex gap-3 m-3">
      <button @click.stop="addView(data)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">+</button>
      <button @click.stop="active = data" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">C</button>
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
  root?: boolean
  data: LayoutView
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

function removeView(view) {
  const index = props.data.views.indexOf(view)
  props.data.views.splice(index, 1)
}
</script>