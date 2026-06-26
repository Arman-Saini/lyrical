import type { LyricLine } from '../types'

const TIMESTAMP_RE = /^\[(\d{2}):(\d{2})\.(\d{2,3})\]\s*(.*)/

export function parseLRC(text: string): LyricLine[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .flatMap(line => {
      const match = line.match(TIMESTAMP_RE)
      if (!match) return []
      const [, min, sec, ms, text] = match
      if (!text.trim()) return []
      const timeMs = parseInt(min) * 60_000 + parseInt(sec) * 1_000 +
        (ms.length === 3 ? parseInt(ms) : parseInt(ms) * 10)
      return [{ timeMs, text: text.trim() }]
    })
    .sort((a, b) => a.timeMs - b.timeMs)
}
