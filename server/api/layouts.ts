// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

export default defineEventHandler(async (event) => {
  const layouts = await useStorage('data').getKeys('layout/')
  return layouts.map((layout) => layout.slice("layout:".length))
})
