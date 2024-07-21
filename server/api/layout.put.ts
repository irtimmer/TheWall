export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  const body = await readBody(event)

  await useStorage('data').setItem(`layout/${id}`, body)
})
