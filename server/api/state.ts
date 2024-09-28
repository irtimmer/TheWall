// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

export default defineEventHandler((event) => {
  const { id } = getQuery(event);
  if (!id)
    throw new Error('id is required')

  const currentState = getState(id.toString())
  return currentState || {
    type: "root",
    views: [],
    constraints: {
      width: 4,
      height: 4
    }
  }
})