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
import { useRoute } from 'vue-router'

const route = useRoute()
const id = route.params.id
const { data } = await useFetch(`/api/state?id=${id}`)
const activeView = ref<View | null>(null)
const sidebarVisible = computed<boolean>({
  get: () => !!activeView.value,
  set: v => activeView.value = v ? activeView.value : null
})

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
