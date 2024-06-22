export default defineEventHandler((event) => {
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  const currentState = getState(id.toString())
  return currentState || {
    views: [{
      url: "about:blank",
      top: 0,
      left: 0,
      width: 100,
      height: 100
    }]
  }
})