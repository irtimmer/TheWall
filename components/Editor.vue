<template>
  <div class="relative mt-6 flex-1 px-4 sm:px-6">
    <SelectButton v-model="internalView.type" :options="viewTypes" optionLabel="label" optionValue="value" class="mb-2" />
    <div v-if="internalView.type === 'layout'" class="flex">
      <InputText type="text" v-model="internalView.constraints.width" class="my-2 flex-1 w-0" />
      <InputText type="text" v-model="internalView.constraints.height" class="my-2 flex-1 w-0" />
    </div>
    <InputText v-else type="text" v-model="internalView.url" class="my-2" />
    <Button @click="save">Save</Button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  view: View
}>()

const internalView = ref(structuredClone(toRaw(props.view)))

const viewTypes = [
  { label: 'Layout', value: 'layout'},
  { label: 'Web', value: 'iframe' },
  { label: 'Image', value: 'img' },
  { label: 'Video', value: 'video' },
]

watch(() => props.view.type, async (type, oldType) => {
  if (type === 'layout') {
    props.view.constraints = { width: 4, height: 4 }
    delete props.view.url
  } else if (oldType == 'layout') {
    props.view.url = 'about:blank'
    delete props.view.constraints
    delete props.view.views
  }
})

function save() {
  for (let key in props.view)
    if (props.view.hasOwnProperty(key))
      delete props.view[key]

  Object.assign(props.view, structuredClone(toRaw(internalView.value)))
}
</script>
