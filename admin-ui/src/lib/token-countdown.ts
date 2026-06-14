interface FormatTokenCountdownOptions {
  expiresAt: string | null
  lastUsedAt: string | null
  now?: Date
}

const TOKEN_TTL_MS = 60 * 60 * 1000

function parseTime(value: string | null): number | null {
  if (!value) {
    return null
  }

  const time = new Date(value).getTime()
  return Number.isNaN(time) ? null : time
}

export function formatTokenCountdown({
  expiresAt,
  lastUsedAt,
  now = new Date(),
}: FormatTokenCountdownOptions): string {
  const explicitExpiresAt = parseTime(expiresAt)
  const fallbackLastUsedAt = parseTime(lastUsedAt)
  const expiresAtMs = explicitExpiresAt ?? (
    fallbackLastUsedAt === null ? null : fallbackLastUsedAt + TOKEN_TTL_MS
  )

  if (expiresAtMs === null) {
    return '未知'
  }

  const remainingMs = expiresAtMs - now.getTime()
  if (remainingMs <= 0) {
    return '已过期'
  }

  const totalSeconds = Math.ceil(remainingMs / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours} 小时 ${minutes} 分钟`
  }

  if (minutes > 0) {
    return seconds > 0 ? `${minutes} 分 ${seconds} 秒` : `${minutes} 分钟`
  }

  return `${seconds} 秒`
}
