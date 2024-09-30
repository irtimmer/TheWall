<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <a v-if="source && !stream" @click.stop="startStream">Start stream</a>
  <video v-else-if="!hidden" ref="videoView" autoplay></video>
  <p v-else>Stream</p>
</template>

<script setup lang="ts">
import { useEventBus } from '@vueuse/core';

const props = defineProps<{
  source?: 'screen',
  id: string,
  receiver: string
  hidden?: boolean
}>()

const videoView = ref<HTMLVideoElement | null>(null)

const webrtcBus = useEventBus<{id: string, data: any}>('webrtc')
async function sendSignal(data: any) {
  await useFetch(`/api/event?id=${props.receiver}`, {
    method: 'POST',
    body: JSON.stringify({
      "action": "webrtc",
      "id": props.id,
      "data": data
    }),
  })
}

const connection = ref<RTCPeerConnection | undefined>()
const stream = ref<MediaStream | undefined>()

onMounted(async () => {
  const { pc, description, candidate, onsignal } = useWebRTC(true, videoView.value)
  connection.value = pc

  webrtcBus.on((event) => {
    if (event.id == props.id) {
      if (event.data.restartIce)
        pc.restartIce()
      else
        onsignal(event)
    }
  })
  watch(description, async (description) => {
    if (description)
      sendSignal({ description })
  })
  watch(candidate, async (candidate) => {
    if (candidate)
      sendSignal({ candidate })
  })

  pc.addEventListener("iceconnectionstatechange", () => {
    if (pc.iceConnectionState === "failed") {
      stream.value?.getTracks().forEach(track => track.stop())
      stream.value = undefined
    }
  })

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
      stream.value?.getTracks().forEach(track => track.stop())
      stream.value = undefined
    }
  }
})

async function startStream() {
  if (props.source == 'screen')
    stream.value = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true })
  else
    return

  if (connection.value?.iceConnectionState === "failed") {
    sendSignal({ restartIce: true })
    connection.value.restartIce()
  }

  for (const track of stream.value.getTracks())
    connection.value?.addTrack(track, stream.value)
}

onUnmounted(() => {
  stream.value?.getTracks().forEach(track => track.stop())
  connection.value?.close()
})
</script>
