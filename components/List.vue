<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <View :view="activeView" />
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';

const props = defineProps<{
  view: LayoutView
}>()

const index = ref(0)
const activeView = computed(() => ({
  ...props.view.views[index.value],
  top: 0,
  left: 0,
  width: props.view.width,
  height: props.view.height
}))
useIntervalFn(() => {
  index.value = (index.value + 1) % props.view.views.length
}, 5000)
</script>
