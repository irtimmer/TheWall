// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

type BaseView = {
  id: string
  top: number
  left: number
  width: number
  height: number
}

type BaseResourceView = BaseView & {
  url: string
  reload: number
}

type BaseLayoutView = {
  views: ChildView[]
  constraints: {
    width: number
    height: number
  }
}

export type RootView = BaseLayoutView & {
  type: "root"
}

export type LayoutView = BaseView & BaseLayoutView & {
  type: "layout"
}

export type ListView = BaseView & BaseLayoutView & {
  type: "list"
  transition?: string
  timeout: number
}

export type IFrameView = BaseResourceView & {
  type: "iframe"
  css: string
  script: string
  effects: string[]
  zoom: number
}

export type VideoView = BaseResourceView & {
  type: "video"
}

export type ImgView = BaseResourceView & {
  type: "img"
}

export type WebRTCView = BaseResourceView & {
  type: "webrtc"
}

export type View = RootView | ListView | LayoutView | IFrameView | VideoView | ImgView | WebRTCView

export type ContainerView = RootView | LayoutView | ListView
export type ResourceView = IFrameView | VideoView | ImgView | WebRTCView
export type ChildView = Exclude<View, RootView>

export const viewStyle = (view: Ref<ChildView>) => computed(() => {
  return {
    position: 'absolute',
    top: view.value.top + '%',
    left: view.value.left + '%',
    height: view.value.height + '%',
    width: view.value.width + '%',
  }
})

export function addView(layout: ContainerView) {
  if (!layout.views)
    layout.views = []

  layout.views.push({
    id: crypto.randomUUID(),
    type: 'iframe',
    url: 'about:blank',
    top: 0,
    left: 0,
    height: 25,
    width: 25,
    zoom: 1,
    reload: 0,
    css: "",
    script: "",
    effects: []
  })
}
