<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <iframe v-if="view.type == 'iframe'" @load="frameLoaded" :src="view.url" sandbox="allow-scripts allow-same-origin" ref="iframeView" :key="view.url" />
  <img v-else-if="view.type == 'img'" :src="view.url" :key="view.url" />
  <video v-else-if="view.type == 'video'" :src="view.url" ref="videoView" autoplay :key="view.url" />
  <List v-else-if="view.type == 'list'" :view="view" />
</template>

<style scoped>
video {
  background-color: black;
}

img, iframe, video {
  position: absolute;
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  view: View
}>()

const iframeView = ref<HTMLIFrameElement | null>(null)

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
