const receivers: Record<string, (data: any) => Promise<void>> = {}

export function registerReceiver(name: string, receiver: (data: any) => Promise<void>) {
  receivers[name] = receiver
}

export function unregisterReceiver(name: string) {
  delete receivers[name]
}

export function getReceiver(name: string) {
  return receivers[name]
}
