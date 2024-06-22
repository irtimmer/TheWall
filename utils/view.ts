export type View = {
  class?: string[]
  url: string
  top: number
  left: number
  width: number
  height: number
}

export const viewStyle = (view: View) => computed(() => {
  return {
    position: 'absolute',
    top: view.top + 'vh',
    left: view.left + 'cqw',
    height: view.height + 'vh',
    width: view.width + 'cqw',
  }
})
