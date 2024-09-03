// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

type LayoutView = {
  type: "layout"
  views: View[]
  constraints: {
    width: number
    height: number
  }
  top: number
  left: number
  width: number
  height: number
}

type ResourceView = {
  type: "iframe" | "video" | "img"
  url: string
  top: number
  left: number
  width: number
  height: number
}

export type View = LayoutView | ResourceView

export const viewStyle = (view: Ref<View>) => computed(() => {
  return {
    position: 'absolute',
    top: view.value.top + '%',
    left: view.value.left + '%',
    height: view.value.height + '%',
    width: view.value.width + '%',
  }
})
