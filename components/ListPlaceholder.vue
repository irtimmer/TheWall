<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div class="p-2">
    <div :class="activeClass" @click.stop="activate" class="card border-white border-2 bg-white shadow-md flex">
      <Layout v-if="view.type === 'layout'" :data="view" v-model:active="active" class="flex-1" />
      <ListLayout v-else-if="view.type === 'list'" :data="view" v-model:active="active" class="flex-1" />
      <p v-else-if="view.type === 'webrtc'" class="text-center">
        <WebRTC source="screen" :id="view.id" :receiver="remoteid" hidden />
      </p>
      <p v-else class="flex-1">
        <img v-if="favicon" :src="favicon" class="w-4 h-4 inline" />
        {{ view.url }}
      </p>
      <button @mousedown.stop @click.stop="addView(view)" v-if="view.type === 'layout' || view.type === 'list'" class="flex-none mr-2 text-black z-10">+</button>
      <button @mousedown.stop @click.stop="$emit('close')" class="flex-none mr-2 text-black z-10">X</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  box-sizing: border-box;
}
</style>

<script setup lang="ts">
const active = defineModel<View>("active")
const props = defineProps<{
  view: ChildView
}>()

const remoteid = useState<string>('remoteid')
const favicon = useFavicon(toRef(() => props.view.url))

const activated = computed(() => active.value === props.view)
const activeClass = computed(() => ({
  'cursor-pointer': !activated.value,
  'hover:border-gray-200': !activated.value,
  'border-2': activated.value,
  'border-gray-500': activated.value,
}))

const activate = (event: MouseEvent) => {
  active.value = props.view
}

defineEmits(['close'])
</script>
