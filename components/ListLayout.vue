<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div ref="container" class="list-layout">
    <template v-for="view in data.views" :key="view.id">
      <ListPlaceholder @close="removeView(view)" v-model:active="active" :view="view" />
    </template>
  </div>
</template>

<style scoped>
.list-layout {
  container-type: size;
  position: relative;
  height: 100%;
  width: 100%;
  overflow-y: scroll;
}
</style>

<script setup lang="ts">
const active = defineModel<View>("active")
const props = defineProps<{
  data: LayoutView
}>()

const container = ref(null)

function removeView(view) {
  const index = props.data.views.indexOf(view)
  props.data.views.splice(index, 1)
}
</script>