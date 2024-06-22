export type View = {
  type: "iframe" | "video" | "image"
  url: string
  top: number
  left: number
  width: number
  height: number
}

export const viewStyle = (view: Ref<View>) => computed(() => {
  return {
    position: 'absolute',
    top: view.value.top + 'vh',
    left: view.value.left + 'cqw',
    height: view.value.height + 'vh',
    width: view.value.width + 'cqw',
  }
})
