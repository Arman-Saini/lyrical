import { describe, it, expect } from 'vitest'
import { parseCurrentlyPlaying } from '../spotify/player'

const mockResponse = {
  is_playing: true,
  progress_ms: 45000,
  item: {
    id: 'abc123',
    name: 'Blinding Lights',
    duration_ms: 200000,
    artists: [{ name: 'The Weeknd' }],
    album: {
      name: 'After Hours',
      images: [{ url: 'https://example.com/art.jpg', width: 640, height: 640 }],
    },
  },
}

describe('parseCurrentlyPlaying', () => {
  it('extracts track, progressMs and isPlaying from valid response', () => {
    const result = parseCurrentlyPlaying(mockResponse)
    expect(result).not.toBeNull()
    expect(result!.track.name).toBe('Blinding Lights')
    expect(result!.track.artist).toBe('The Weeknd')
    expect(result!.track.album).toBe('After Hours')
    expect(result!.track.artUrl).toBe('https://example.com/art.jpg')
    expect(result!.track.durationMs).toBe(200000)
    expect(result!.progressMs).toBe(45000)
    expect(result!.isPlaying).toBe(true)
  })

  it('returns null when item is null (nothing playing)', () => {
    expect(parseCurrentlyPlaying({ is_playing: false, item: null })).toBeNull()
  })

  it('returns null for malformed response', () => {
    expect(parseCurrentlyPlaying(null)).toBeNull()
    expect(parseCurrentlyPlaying({})).toBeNull()
  })
})
