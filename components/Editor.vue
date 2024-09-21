<!-- Copyright (C) 2024 Iwan Timmer -->
<!-- SPDX-License-Identifier: AGPL-3.0-or-later -->

<template>
  <div class="relative mt-6 flex-1 px-4 sm:px-6">
    <SelectButton v-if="internalView.type != 'root'" v-model="internalView.type" :options="viewTypes" optionLabel="label" optionValue="value" class="mb-2" />
    <template v-if="internalView.type === 'layout' || internalView.type === 'root'">
      <div class="flex">
        <InputText type="text" v-model="internalView.constraints.width" class="my-2 flex-1 w-0" />
        <InputText type="text" v-model="internalView.constraints.height" class="my-2 flex-1 w-0" />
      </div>
      <div class="flex flex-col my-2">
        <Listbox v-model="selectedLayout" :options="layouts" class="w-full" />
        <Button @click="loadLayout" :disabled="!selectedLayout">Load</Button>
        <InputText type="text" v-model="saveName" class="mt-2" placeholder="Enter save name" />
        <Button @click="saveLayout" :disabled="!saveName">Save</Button>
      </div>
    </template>
    <InputText v-else type="text" v-model="internalView.url" class="my-2" />
    <template v-if="internalView.type === 'iframe'">
      <Button @click="editCss = true">Edit CSS</Button>
      <Button @click="editScript = true">Edit Script</Button>
      <Dialog v-model:visible="editCss" header="Edit CSS">
        <div class="flex flex-col">
          <Textarea type="text" v-model="internalView.css" class="my-2" rows="20" />
        </div>
      </Dialog>
      <Dialog v-model:visible="editScript" header="Edit Script">
        <div class="flex flex-col">
          <Textarea type="text" v-model="internalView.script" class="my-2" rows="20" />
        </div>
      </Dialog>
    </template>
    <Button @click="save">Save</Button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  view: View
}>()

const internalView = ref(structuredClone(toRaw(props.view)))
const editCss = ref(false)
const editScript = ref(false)

const viewTypes = [
  { label: 'Layout', value: 'layout'},
  { label: 'Web', value: 'iframe' },
  { label: 'Image', value: 'img' },
  { label: 'Video', value: 'video' },
]

watch(() => internalView.value.type, async (type, oldType) => {
  if (type === 'layout') {
    internalView.value.constraints = { width: 4, height: 4 }
    delete internalView.value.url
  } else if (oldType == 'layout') {
    internalView.value.url = 'about:blank'
    delete internalView.value.constraints
    delete internalView.value.views
  }
})

function save() {
  for (let key in props.view)
    if (props.view.hasOwnProperty(key))
      delete props.view[key]

  Object.assign(props.view, structuredClone(toRaw(internalView.value)))
}

const { data: layouts } = await useFetch('/api/layouts')
const selectedLayout = ref('')
const saveName = ref('')

function loadLayout() {
  useFetch(`/api/layout?id=${selectedLayout.value}`).then((layout) => {
    console.log("Layout", layout.data.value)
    props.view.constraints = layout.data.value.constraints
    props.view.views = layout.data.value.views
  })
}

function saveLayout() {
  useFetch(`/api/layout?id=${saveName.value}`, {
    method: 'PUT',
    body: JSON.stringify(props.view),
  })
}
</script>
