<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <iframe v-if="view.type == 'iframe'" :class="effectClasses" @load="frameLoaded" :src="view.url" sandbox="allow-scripts allow-same-origin" ref="iframeView" :key="key" />
  <img v-else-if="view.type == 'img'" :class="effectClasses" :src="view.url" :key="key" />
  <video v-else-if="view.type == 'video'" :class="effectClasses" :src="view.url" autoplay :key="key" />
  <WebRTC v-else-if="view.type == 'webrtc'" :class="effectClasses" :receiver="view.url" :id="view.id" :key="key" />
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
  view: ChildView
}>()

const reloadCounter = ref(0)
const key = computed(() => props.view.url + reloadCounter.value)

const effectClasses = computed(() => props.view.effects?.map(effect => `${effect}-effect`))

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

let currentInterval: NodeJS.Timeout | undefined;

onUnmounted(() => {
  if (currentInterval)
    clearInterval(currentInterval)
})

watchEffect(() => {
  if (currentInterval) {
    clearInterval(currentInterval);
    currentInterval = undefined;
  }

  if (props.view.reload && props.view.reload > 0) {
    let ms = props.view.reload * 1000
    if (props.view.reload > 120)
      ms = props.view.reload * 60 * 60 * 1000
    else if (props.view.reload > 60)
      ms = props.view.reload * 60 * 1000

    currentInterval = setInterval(() => reloadCounter.value++, ms)
  }
})
</script>
