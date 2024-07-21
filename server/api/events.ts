import { registerReceiver, unregisterReceiver } from "../utils/receivers"

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  // Notify the client of the current state
  const currentState = getState(id.toString())
  if (currentState)
    await eventStream.push(JSON.stringify({
      action: 'setup',
      data: currentState
    }))

  registerReceiver(id.toString(), async (data) => {
    await eventStream.push(JSON.stringify(data))
  })

  eventStream.onClosed(async () => {
    await eventStream.close()
    unregisterReceiver(id.toString())
  })
  
  return eventStream.send()
})
