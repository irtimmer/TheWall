<template>
  <div :style="style">
   <iframe v-if="view.type == 'iframe'" :src="view.url" />
   <img v-else-if="view.type == 'img'" :src="view.url" />
   <video v-else-if="view.type == 'video'" :src="view.url" autoplay />
  </div>
</template>

<style scoped>
video {
  background-color: black;
}

div > * {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  view: View
}>()

const style = viewStyle(toRef(() => props.view))
</script>
