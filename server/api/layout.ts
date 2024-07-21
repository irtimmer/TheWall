export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  const layout = await useStorage('data').getItem(`layout/${id}`)
  if (!layout)
    throw new Error('layout not found')

  return layout
})
