// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

import { getReceiver } from "../utils/receivers"
import { registerState } from "../utils/states";

export default defineEventHandler(async (event) => {
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  const body = await readBody(event)
  if (!body)
    throw new Error('body is required')

  if (body.action === 'setup')
    registerState(id.toString(), body.data)

  await getReceiver(id.toString())?.(body)
})
