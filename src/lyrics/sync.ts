import type { LyricLine } from '../types'

export function getActiveLyricIndex(lyrics: LyricLine[], progressMs: number): number {
  if (!lyrics.length || progressMs < 0) return -1
  let idx = -1
  for (let i = 0; i < lyrics.length; i++) {
    if (lyrics[i].timeMs <= progressMs) idx = i
    else break
  }
  return idx
}
