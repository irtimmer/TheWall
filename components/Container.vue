<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div @transitionend="endTransition" :style="style">
    <Transition name="fade">
      <View :view="view" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  view: ChildView
}>()

const scaleModel = ref({
  transition: true,
  width: props.view.width,
  height: props.view.height,
  scaleX: 1,
  scaleY: 1
})

watch(() => props.view, view => {
  scaleModel.value.transition = true
  scaleModel.value.scaleX = view.width / scaleModel.value.width
  scaleModel.value.scaleY = view.height / scaleModel.value.height
})

const style = computed(() => {
  return {
    position: 'absolute',
    height: scaleModel.value.height + 'vh',
    width: scaleModel.value.width + 'vw',
    'transform-origin': 'top left',
    transform: `translate(${props.view.left}vw, ${props.view.top}vh) scale(${scaleModel.value.scaleX}, ${scaleModel.value.scaleY})`,
    transition: scaleModel.value.transition ? `transform 0.5s ease-in-out` : null
  }
})

const endTransition = () => {
  scaleModel.value = {
    transition: false,
    width: props.view.width,
    height: props.view.height,
    scaleX: 1,
    scaleY: 1
  }
}
</script>
