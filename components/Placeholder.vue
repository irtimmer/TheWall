<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div :style="style" class="p-2">
    <div :class="activeClass" @click="activate" class="card hover:border-2 bg-white shadow-md flex justify-center items-center h-screen">
      <Layout v-if="view.type === 'layout'" :data="view" />
      <p v-else class="text-center">{{ view.url }}</p>
      <div class="title-bar flex justify-end items-center absolute top-0 right-0" @mousedown="startMove">
        <button @click.stop="addView(view)" class="mr-2 text-white z-10">+</button>
        <button @click="$emit('close')" class="mr-2 text-white z-10">X</button>
      </div>
      <div class="resize-handle" @mousedown="startResize"></div>
    </div>
    <div class="adjust-overlay" :style="overlayStyle" v-show="adjust"></div>
  </div>
</template>

<style scoped>
.card {
  box-sizing: border-box;
  position: relative;
  height: 100%;
  width: 100%;
}

.adjust-overlay {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(255, 0, 0, 0.5);
}

.title-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 20px;
  background: gray;
  cursor: move;
}

.resize-handle {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 0;
  height: 0;
  border: 10px solid gray;
  border-left-color: transparent;
  border-top-color: transparent;
  cursor: se-resize;
}
</style>

<script setup lang="ts">
const active = defineModel<View>("active")
const props = defineProps<{
  view: View
  container: {
   width: number
   height: number
   constraints: {
     width: number
     height: number
   }
  }
}>()

defineEmits(['close'])

const style = viewStyle(toRef(() => props.view))

const overlayStyle = computed(() => ({
  width: overlayWidth.value + 'cqw',
  height: overlayHeight.value + 'cqh',
  top: overlayTop.value - props.view.top + 'cqh',
  left: overlayLeft.value - props.view.left + 'cqw'
}))

const activated = computed(() => active.value === props.view)

const activeClass = computed(() => ({
  'cursor-pointer': !activated.value,
  'hover:border-gray-200': !activated.value,
  'border-2': activated.value,
  'border-gray-500': activated.value,
}))

const snapWidth = computed(() => 100 / props.container.constraints.width)
const snapHeight = computed(() => 100 / props.container.constraints.height)

let adjust = ref<((dx: number, dy: number) => void) | null>(null);
let initialX = ref(0);
let initialY = ref(0);

let overlayWidth = ref(0);
let overlayHeight = ref(0);
let overlayTop = ref(0);
let overlayLeft = ref(0);

const startMove = (event: MouseEvent) => startAdjust(event, move)
const startResize = (event: MouseEvent) => startAdjust(event, resize)

const move = (dx: number, dy: number) => {
  let newTop = props.view.top + (dy / props.container.height) * 100
  let newLeft = props.view.left + (dx / props.container.width) * 100
  if (props.container.constraints) {
    newTop = Math.round(newTop / snapHeight.value) * snapHeight.value
    newLeft = Math.round(newLeft / snapWidth.value) * snapWidth.value
  }
  overlayTop.value = Math.max(0, Math.min(newTop, 100 - overlayHeight.value))
  overlayLeft.value = Math.max(0, Math.min(newLeft, 100 - overlayWidth.value))
}

const resize = (dx: number, dy: number) => {
  let newWidth = props.view.width + (dx / props.container.width) * 100
  let newHeight = props.view.height + (dy / props.container.height) * 100
  if (props.container.constraints) {
    newWidth = Math.round(newWidth / snapWidth.value) * snapWidth.value
    newHeight = Math.round(newHeight / snapHeight.value) * snapHeight.value
  }
  overlayWidth.value = Math.max(0, Math.min(newWidth, 100 - overlayLeft.value))
  overlayHeight.value = Math.max(0, Math.min(newHeight, 100 - overlayTop.value))
}

const startAdjust = (event: MouseEvent, action: (dx: number, dy: number) => void) => {
  initialX.value = event.clientX;
  initialY.value = event.clientY;
  overlayWidth.value = props.view.width;
  overlayHeight.value = props.view.height;
  overlayTop.value = props.view.top;
  overlayLeft.value = props.view.left;
  adjust.value = action;
  window.addEventListener('mousemove', moveAdjust);
  window.addEventListener('mouseup', stopAdjust);
  event.preventDefault()
}

const moveAdjust = (event: MouseEvent) => {
  const dx = event.clientX - initialX.value;
  const dy = event.clientY - initialY.value;
  adjust.value?.(dx, dy);
}

const stopAdjust = (event: MouseEvent) => {
  props.view.top = overlayTop.value;
  props.view.left = overlayLeft.value;
  props.view.width = overlayWidth.value;
  props.view.height = overlayHeight.value;
  window.removeEventListener('mousemove', moveAdjust);
  window.removeEventListener('mouseup', stopAdjust);
  event.preventDefault()
  setTimeout(() => {
    adjust.value = null
  }, 0)
}

const activate = (event: MouseEvent) => {
  if (preventClick)
    event.stopPropagation()
  else
    active.value = props.view
}
</script>
