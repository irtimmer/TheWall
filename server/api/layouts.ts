export default defineEventHandler(async (event) => {
  const layouts = await useStorage('data').getKeys('layout/')
  return layouts.map((layout) => layout.slice("layout:".length))
})
