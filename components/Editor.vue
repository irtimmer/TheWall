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
        <Button @click="loadLayout" :disabled="!selectedLayout" label="Load" />
        <InputText type="text" v-model="saveName" class="mt-2" placeholder="Enter save name" />
        <Button @click="saveLayout" :disabled="!saveName" label="Save" />
      </div>
    </template>
    <template v-else-if="internalView.type === 'list'">
      <Dropdown v-model="internalView.transition" :options="transitions" optionLabel="name" optionValue="value" placeholder="Select an effect" class="w-full my-2" />
      Switch every {{ internalView.timeout }}s
      <Slider v-model="internalView.timeout" :min=1 :max=300 class="w-full my-4" />
    </template>
    <InputText v-else-if="internalView.type !== 'webrtc'" type="text" v-model="internalView.url" class="my-2" />
    <template v-if="internalView.type !== 'layout' && internalView.type !== 'root' && internalView.type !== 'list'">
      <SelectButton v-model="internalView.effects" multiple :options="effects" optionLabel="label" optionValue="value" class="w-full mb-2" />
      <template v-if="internalView.reload > 0">
        Refresh every
        <template v-if="internalView.reload > 120">
          {{ internalView.reload - 120 }}h
        </template>
        <template v-else-if="internalView.reload > 60">
          {{ internalView.reload - 60 }}m
        </template>
        <template v-else>
          {{ internalView.reload }}s
        </template>
      </template>
      <template v-else>
        No reloads
      </template>
      <Slider v-model="internalView.reload" :min=0 :max=144 :step=1 class="w-full my-4" />
    </template>
    <template v-if="internalView.type === 'iframe'">
      Zoom level {{ internalView.zoom }}
      <Slider v-model="internalView.zoom" :min=.25 :max=4 :step=.25 class="w-full my-4" />
      <Button @click="editCss = true" label="Edit CSS" />
      <Button @click="editScript = true" label="Edit Script" />
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
    <Button @click="apply" label="Apply" />
  </div>
</template>

<script setup lang="ts">
const visible = defineModel<boolean>("visible")
const props = defineProps<{
  view: View
}>()

const internalView = ref(structuredClone(toRaw(props.view)))
const editCss = ref(false)
const editScript = ref(false)

const viewTypes = [
  { label: 'Layout', value: 'layout'},
  { label: 'List', value: 'list' },
  { label: 'Web', value: 'iframe' },
  { label: 'Image', value: 'img' },
  { label: 'Video', value: 'video' },
  { label: 'WebRTC', value: 'webrtc' }
]

const transitions = [
  { name: 'None', value: undefined },
  { name: 'Fade', value: 'fade' },
  { name: 'Slide', value: 'slide' },
  { name: 'Slide (fade)', value: 'slide-fade'},
  { name: 'Flip', value: 'flip' },
  { name: 'Grow', value: 'grow' },
  { name: 'Morph', value: 'morph' },
  { name: 'Morph (out)', value: 'morph-out'},
]

const effects = [
  { label: 'Card', value: 'card' },
  { label: 'Transparent', value: 'transparent'}
]

watch(() => internalView.value.type, async (type, oldType) => {
  if (type === 'layout') {
    internalView.value.constraints = { width: 4, height: 4 }
    delete internalView.value.url
  } else if (type === 'list') {
    if (oldType != 'layout') {
      internalView.value.views = [structuredClone(toRaw(internalView.value))]
      internalView.value.views[0].type = oldType
      internalView.value.id = crypto.randomUUID()
    }
    internalView.value.effect = 'fade'
    internalView.value.timeout = 5
    delete internalView.value.constraints
    delete internalView.value.url
  } else if (oldType == 'layout') {
    internalView.value.url = 'about:blank'
    delete internalView.value.constraints
    delete internalView.value.views
  } else if (oldType == 'list') {
    if (internalView.value.views.length == 1 && internalView.value.views[0].type == type) {
      internalView.value = {...toRaw(internalView.value.views[0])}
    }
    delete internalView.value.views
  }
})

function apply() {
  for (let key in props.view)
    if (props.view.hasOwnProperty(key))
      delete props.view[key]

  Object.assign(props.view, structuredClone(toRaw(internalView.value)))
  visible.value = false
}

const { data: layouts } = await useFetch('/api/layouts')
const selectedLayout = ref('')
const saveName = ref('')

function loadLayout() {
  useFetch(`/api/layout?id=${selectedLayout.value}`).then((layout) => {
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
