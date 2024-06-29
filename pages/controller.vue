<template>
  <div class="h-screen overflow-hidden">
    <Layout v-if="data" @click="activeView = data" :data="data" v-model:active="activeView"/>
    <Sidebar v-model:visible="activeView" position="right">
      <Editor v-if="activeView" :webrtc="webrtc" :view="activeView"/>
    </Sidebar>
</div>
</template>

<style>
@import url("~/assets/css/base.css");
</style>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const container = ref(null)
const containerDescr = ref({
  width: 0,
  height: 0
})

useResizeObserver(container, (entries) => {
  const { width, height } = entries[0].contentRect
  containerDescr.value = {
    width, height
  }
})

const route = useRoute()
const id = route.query.id
const { data } = await useFetch(`/api/state?id=${id}`)
const activeView = ref(null)

watch(data, data => {
  useFetch(`/api/event?id=${id}`, {
    method: 'POST',
    body: JSON.stringify({
      "action": "setup",
      data
    }),
  })
}, { immediate: true, deep: true })
</script>
