<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <a v-if="source && !streaming" @click.stop="startStream">Start stream</a>
  <video v-else-if="!hidden" ref="videoView" autoplay></video>
  <p v-else>Stream</p>
</template>

<script setup lang="ts">
import { useEventBus } from '@vueuse/core';

const props = defineProps<{
  source?: 'screen',
  id: string,
  receiver?: string
  hidden?: boolean
}>()

const remoteid = ref(props.receiver)
const videoView = ref<HTMLVideoElement | null>(null)

const localid = useState('localid')
const webrtcBus = useEventBus<{id: string, remote: string, data: any}>('webrtc')
async function sendSignal(data: any) {
  // Ignore empty signals
  if (!remoteid.value)
    return

  if (!data.candidate && !data.description)
    return

  await $fetch(`/api/event?id=${remoteid.value}`, {
    method: 'POST',
    body: JSON.stringify({
      "action": "webrtc",
      "id": props.id,
      "remote": localid.value,
      "data": data
    }),
  })
}

const streaming = ref(false)
let pc: RTCPeerConnection | undefined
let stream: MediaStream | undefined
let onsignal: ((data: any) => void) | undefined

function connect() {
  ({ pc, onsignal } = useWebRTC(!props.hidden, sendSignal, videoView.value))

  pc.onconnectionstatechange = () => {
    if (pc.connectionState === 'disconnected' || pc.connectionState === 'closed') {
      stream?.getTracks().forEach(track => track.stop())
      stream = undefined
      streaming.value = false
    }
  }
}
onMounted(connect)

webrtcBus.on((event) => {
    if (event.id == props.id) {
      if (remoteid.value && remoteid.value != event.remote) {
        pc?.close()
        connect()
      }

      remoteid.value = event.remote
      onsignal?.(event)
    }
  })

async function startStream() {
  if (props.source == 'screen')
    stream = await navigator.mediaDevices.getDisplayMedia({ audio: false, video: true })
  else
    return

  if (pc?.iceConnectionState === 'disconnected')
    connect()

  for (const track of stream.getTracks())
    pc?.addTrack(track, stream)

  streaming.value = true
}

onUnmounted(() => {
  stream?.getTracks().forEach(track => track.stop())
  pc?.close()
})
</script>
