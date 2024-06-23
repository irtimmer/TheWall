<template>
  <div class="relative mt-6 flex-1 px-4 sm:px-6">
    <SelectButton v-model="view.type" :options="viewTypes" optionLabel="label" optionValue="value" class="mb-2" />
    <InputText type="text" v-model="view.url" class="my-2" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  view: View
}>()

const viewTypes = [
  { label: 'Web', value: 'iframe' },
  { label: 'Image', value: 'img' },
  { label: 'Video', value: 'video' },
]
</script>
