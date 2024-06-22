<template>
  <div :style="style" class="p-2" :class="view.class">
   <div :class="activeClass" class="card hover:border-2 bg-white shadow-md flex justify-center items-center h-screen">
    <div class="title-bar" @mousedown="startMove"></div>
    <p class="text-center">{{ view.url }}</p>
    <div class="adjust-overlay" :style="overlayStyle" v-show="adjust"></div>
    <div class="resize-handle" @mousedown="startResize"></div>
   </div>
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
  width: 20px;
  height: 20px;
  background: gray;
  cursor: se-resize;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  active: boolean
  view: View
  container: {
   width: number
   height: number
  }
}>()

const style = viewStyle(toRef(() => props.view))

const overlayStyle = computed(() => ({
  width: overlayWidth.value + 'cqw',
  height: overlayHeight.value + 'vh',
  top: overlayTop.value - props.view.top + 'vh',
  left: overlayLeft.value - props.view.left + 'cqw',
}))

const activeClass = computed(() => ({
  'cursor-pointer': !props.active,
  'border-2': props.active,
  'hover:border-gray-200': !props.active,
  'border-gray-500': props.active,
}))

let adjust = ref(null);
let initialX = ref(0);
let initialY = ref(0);

let overlayWidth = ref(0);
let overlayHeight = ref(0);
let overlayTop = ref(0);
let overlayLeft = ref(0);

const startMove = (event) => startAdjust(event, move)
const startResize = (event) => startAdjust(event, resize)

const move = (dx, dy) => {
  overlayTop.value = props.view.top + (dy / props.container.height) * 100;
  overlayLeft.value = props.view.left + (dx / props.container.width) * 100;
}

const resize = (dx, dy) => {
  overlayWidth.value = props.view.width + (dx / props.container.width) * 100;
  overlayHeight.value = props.view.height + (dy / props.container.height) * 100;
  console.log('resize', overlayWidth.value, overlayHeight.value, dx, dy);
}

const startAdjust = (event, action) => {
  initialX.value = event.clientX;
  initialY.value = event.clientY;
  overlayWidth.value = props.view.width;
  overlayHeight.value = props.view.height;
  overlayTop.value = props.view.top;
  overlayLeft.value = props.view.left;
  adjust.value = action;
  window.addEventListener('mousemove', moveAdjust);
  window.addEventListener('mouseup', stopAdjust);
}

const moveAdjust = (event) => {
  const dx = event.clientX - initialX.value;
  const dy = event.clientY - initialY.value;
  adjust.value?.(dx, dy);
}

const stopAdjust = () => {
  props.view.top = overlayTop.value;
  props.view.left = overlayLeft.value;
  props.view.width = overlayWidth.value;
  props.view.height = overlayHeight.value;
  adjust.value = false;
  window.removeEventListener('mousemove', resize);
  window.removeEventListener('mousemove', move);
  window.removeEventListener('mouseup', stopAdjust);
}
</script>
