// Copyright (C) 2024 Iwan Timmer
// SPDX-License-Identifier: AGPL-3.0-or-later

const states: Record<string, any> = {}

export function registerState(name: string, state: any) {
  states[name] = state
}

export function getState(name: string) {
  return states[name]
}
