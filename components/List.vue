<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div :class="animationClass" class="relative w-full h-full">
    <Transition v-for="(subView, index) in view.views" :name="view.effect">
      <View v-show="index === active" :view="subView" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core';

const props = defineProps<{
  view: LayoutView
}>()

const animationClass = computed(() => [`${props.view.effect}-parent`])

const timeout = computed(() => props.view.timeout * 1000)
const active = ref(0)
useIntervalFn(() => {
  active.value = (active.value + 1) % props.view.views.length
}, timeout)
</script>
