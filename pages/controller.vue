<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

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
