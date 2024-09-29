<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div class="relative w-full h-full overflow-hidden">
    <Transition v-for="(view, index) in view.views" name="fade">
      <View v-show="index === active" :view="view" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';

const props = defineProps<{
  view: LayoutView
}>()

const active = ref(0)
useIntervalFn(() => {
  active.value = (active.value + 1) % props.view.views.length
}, 5000)
</script>
