const states: Record<string, any> = {}

export function registerState(name: string, state: any) {
  states[name] = state
}

export function getState(name: string) {
  return states[name]
}
