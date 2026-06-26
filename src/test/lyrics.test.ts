import { describe, it, expect } from 'vitest'
import { parseLRC } from '../lyrics/parser'
import { getActiveLyricIndex } from '../lyrics/sync'

const sampleLRC = `[00:00.00]
[00:12.34] First line
[00:15.67] Second line
[01:02.00] Third line
[ar:Test Artist]
[ti:Test Song]`

describe('parseLRC', () => {
  it('parses timestamps to milliseconds', () => {
    const lines = parseLRC(sampleLRC)
    expect(lines[0].timeMs).toBe(12340)
    expect(lines[0].text).toBe('First line')
  })

  it('ignores metadata tags like [ar:] and [ti:]', () => {
    const lines = parseLRC(sampleLRC)
    expect(lines.some(l => l.text.includes('Test Artist'))).toBe(false)
  })

  it('ignores empty lyric lines', () => {
    const lines = parseLRC(sampleLRC)
    expect(lines.every(l => l.text.trim().length > 0)).toBe(true)
  })

  it('parses minutes correctly', () => {
    const lines = parseLRC(sampleLRC)
    const third = lines.find(l => l.text === 'Third line')
    expect(third?.timeMs).toBe(62000)
  })
})

describe('getActiveLyricIndex', () => {
  const lyrics = [
    { timeMs: 0, text: 'A' },
    { timeMs: 5000, text: 'B' },
    { timeMs: 10000, text: 'C' },
  ]

  it('returns -1 before first line', () => {
    expect(getActiveLyricIndex(lyrics, -100)).toBe(-1)
  })

  it('returns index of line whose timeMs <= progressMs', () => {
    expect(getActiveLyricIndex(lyrics, 0)).toBe(0)
    expect(getActiveLyricIndex(lyrics, 4999)).toBe(0)
    expect(getActiveLyricIndex(lyrics, 5000)).toBe(1)
    expect(getActiveLyricIndex(lyrics, 10001)).toBe(2)
  })

  it('returns last index when past all lines', () => {
    expect(getActiveLyricIndex(lyrics, 99999)).toBe(2)
  })
})
