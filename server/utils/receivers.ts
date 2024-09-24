// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

type EventStream = any

const receivers: Record<string, EventStream> = {}

export function registerReceiver(name: string, receiver: EventStream) {
  if (receivers[name])
    receivers[name].close()

  receivers[name] = receiver
}

export function unregisterReceiver(name: string, receiver: EventStream) {
  // Don't unregister if the receiver has changed
  if (receivers[name] !== receiver)
    return

  delete receivers[name]
}

export function getReceiver(name: string) {
  return receivers[name]
}
