// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

export function useFavicon(urlRef: Ref<string>) {
  return computed(() => {
    try {
      const url = new URL(urlRef.value)
      if (!url.host)
        return null

      return `https://www.google.com/s2/favicons?domain=${url.host}`
    } catch {
      return null
    }
  })
}
