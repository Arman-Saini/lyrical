import { getValidToken } from './auth'
import type { Track } from '../types'

interface SpotifyImage { url: string; width: number; height: number }
interface SpotifyResponse {
  is_playing: boolean
  progress_ms: number
  item: {
    id: string
    name: string
    duration_ms: number
    artists: { name: string }[]
    album: { name: string; images: SpotifyImage[] }
  } | null
}

export function parseCurrentlyPlaying(raw: unknown): { track: Track; progressMs: number; isPlaying: boolean } | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as Partial<SpotifyResponse>
  if (!r.item || !r.item.name) return null

  const track: Track = {
    id: r.item.id ?? '',
    name: r.item.name,
    artist: r.item.artists?.[0]?.name ?? 'Unknown Artist',
    album: r.item.album?.name ?? '',
    artUrl: r.item.album?.images?.[0]?.url ?? '',
    durationMs: r.item.duration_ms ?? 0,
  }
  return { track, progressMs: r.progress_ms ?? 0, isPlaying: r.is_playing ?? true }
}

export function startPolling(
  onTrackChange: (track: Track) => void,
  onProgress: (ms: number, isPlaying: boolean) => void
): () => void {
  let lastTrackId: string | null = null
  let active = true

  async function poll() {
    if (!active) return
    const token = await getValidToken()
    if (!token) { setTimeout(poll, 5000); return }

    try {
      const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 204) { setTimeout(poll, 3000); return }
      if (res.status === 429) {
        const retryAfter = (Number(res.headers.get('Retry-After') ?? 10) + 1) * 1000
        setTimeout(poll, retryAfter)
        return
      }
      if (!res.ok) { setTimeout(poll, 5000); return }

      const data = await res.json()
      const parsed = parseCurrentlyPlaying(data)
      if (parsed) {
        if (parsed.track.id !== lastTrackId) {
          lastTrackId = parsed.track.id
          // Check active again — StrictMode kills instance A between poll start and response;
          // without this guard, instance A's stale callback fires after instance B has already
          // set the correct track, reverting the UI to the old song.
          if (active) onTrackChange(parsed.track)
        }
        if (active) onProgress(parsed.progressMs, parsed.isPlaying)
      }
    } catch { /* network error — retry */ }

    setTimeout(poll, 2000)
  }

  poll()
  return () => { active = false }
}
