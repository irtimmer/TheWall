// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

type LayoutView = {
  id: string
  type: "layout" | "root"
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
  id: string
  type: "iframe" | "video" | "img"
  css: string
  script: string
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

export function addView(layout: LayoutView) {
  if (!layout.views)
    layout.views = []

  layout.views.push({
    id: crypto.randomUUID(),
    type: 'iframe',
    url: 'about:blank',
    top: 10,
    left: 10,
    height: 25,
    width: 25,
    css: "",
    script: ""
  })
}
