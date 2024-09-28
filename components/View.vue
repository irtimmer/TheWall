<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div @transitionend="endTransition" :style="style">
    <Transition name="fade">
      <iframe v-if="view.type == 'iframe'" @load="frameLoaded" :src="view.url" ref="iframeView" :key="view.url" />
      <img v-else-if="view.type == 'img'" :src="view.url" :key="view.url" />
      <video v-else-if="view.type == 'video'" :src="view.url" ref="videoView" autoplay :key="view.url" />
    </Transition>
  </div>
</template>

<style scoped>
video {
  background-color: black;
}

div > * {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  view: View
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

const iframeView = ref<HTMLIFrameElement | null>(null)
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

watch(() => props.view.css, (css, oldCss) => {
  if (window.wallInjectCss && iframeView.value && css)
    window.wallInjectCss(iframeView.value, css, oldCss)
})

watch(() => props.view.script, script => {
  if (window.wallInjectScript && iframeView.value && script)
    window.wallInjectScript(iframeView.value, script)
})

function frameLoaded() {
  if (window.wallInjectCss && iframeView.value && props.view.css)
    window.wallInjectCss(iframeView.value, props.view.css)
  if (window.wallInjectScript && iframeView && props.view.script)
    window.wallInjectScript(iframeView.value, props.view.script)
}
</script>
