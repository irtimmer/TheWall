<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div class="h-screen overflow-hidden">
    <Layout v-if="data" :data="data" root v-model:active="activeView"/>
    <Sidebar v-model:visible="sidebarVisible" position="right">
      <Editor v-if="activeView" v-model:visible="sidebarVisible" :view="activeView"/>
    </Sidebar>
  </div>
</template>

<style>
@import url("~/assets/css/base.css");
</style>

<script setup lang="ts">
import { useEventBus, useEventSource } from '@vueuse/core'
import { useRoute } from 'vue-router'

const route = useRoute()
const remoteid = useState('remoteid', () => route.params.id)
const { data } = await useFetch(`/api/state?id=${remoteid.value}`)
const activeView = ref<View | null>(null)
const sidebarVisible = computed<boolean>({
  get: () => !!activeView.value,
  set: v => activeView.value = v ? activeView.value : null
})

const localid = useState('localid', () => crypto.randomUUID())
const webrtcBus = useEventBus('webrtc')

onMounted(() => {
  const { data: event } = useEventSource(`/api/events?id=${localid.value}`, [], {
    autoReconnect: true
  })
  watch(event, event => {
    if (!event) return

    const json = JSON.parse(event)
    if (json.action === 'webrtc')
      webrtcBus.emit(json)
  })
})

watch(data, data => {
  useFetch(`/api/event?id=${remoteid.value}`, {
    method: 'POST',
    body: JSON.stringify({
      "action": "setup",
      data
    }),
  })
}, { immediate: true, deep: true })
</script>
