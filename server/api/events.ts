import { registerReceiver, unregisterReceiver } from "../utils/receivers"

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  registerReceiver(id.toString(), async (data) => {
    await eventStream.push(JSON.stringify(data))
  })

  eventStream.onClosed(async () => {
    await eventStream.close()
    unregisterReceiver(id.toString())
  })
  
  return eventStream.send()
})
