// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

import { registerReceiver, unregisterReceiver } from "../utils/receivers"

export default defineEventHandler(async (event) => {
  const eventStream = createEventStream(event)
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  registerReceiver(id.toString(), eventStream)

  // Notify the client of the current state
  const currentState = getState(id.toString())
  if (currentState)
    eventStream.push(JSON.stringify({
      action: 'setup',
      data: currentState
    }))

  eventStream.onClosed(async () => {
    unregisterReceiver(id.toString(), eventStream)
    await eventStream.close()
  })
  
  return eventStream.send()
})
