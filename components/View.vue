<template>
  <div :style="style">
   <iframe :src="view.url" />
  </div>
</template>

<style scoped>
iframe {
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  view: View
}>()

const style = viewStyle(props.view)
</script>
