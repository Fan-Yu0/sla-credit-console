export function uptimeForMinutes(totalMinutes: number, downtimeMinutes: number): number {
  return Math.floor(((totalMinutes - downtimeMinutes) * 10000) / totalMinutes)
}

export function creditForUptime(uptimeBps: number, requiredBps: number): number {
  if (uptimeBps >= requiredBps) return 1
  const shortfall = requiredBps - uptimeBps
  if (shortfall <= 10) return 2
  if (shortfall <= 50) return 3
  return 4
}

export function creditBpsForDecision(decision: number): number {
  if (decision === 2) return 1000
  if (decision === 3) return 2500
  if (decision === 4) return 5000
  return 0
}

export function percentFromBps(value: number): string {
  return (value / 100).toFixed(2) + '%'
}
