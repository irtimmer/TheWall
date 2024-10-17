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

const zoom = props.view.type == 'iframe' && props.view.zoom || 1
const scaleModel = ref({
  transition: true,
  width: props.view.width / zoom,
  height: props.view.height / zoom,
  scaleX: zoom,
  scaleY: zoom
})

watch(() => props.view, view => {
  const zoom = (view.type == 'iframe' && view.zoom) || 1
  scaleModel.value.transition = true
  scaleModel.value.scaleX = (view.width * zoom) / (scaleModel.value.width * scaleModel.value.scaleX)
  scaleModel.value.scaleY = (view.height * zoom) / (scaleModel.value.height * scaleModel.value.scaleY)
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
  const zoom = props.view.type == 'iframe' && props.view.zoom || 1
  scaleModel.value = {
    transition: false,
    width: props.view.width / zoom,
    height: props.view.height / zoom,
    scaleX: zoom,
    scaleY: zoom
  }
}
</script>
