const CACHE_PREFIX = 'lyrical_lrc::'
const BASE = 'https://lrclib.net/api'

async function lrclibGet(
  params: Record<string, string>,
  signal: AbortSignal
): Promise<string | null> {
  const res = await fetch(`${BASE}/get?${new URLSearchParams(params)}`, {
    headers: { 'Lrclib-Client': 'Lyrical/1.0' },
    signal,
  })
  if (!res.ok) return null
  const data = await res.json()
  return (data.syncedLyrics ?? data.plainLyrics ?? null) as string | null
}

export async function fetchLyrics(
  track: string,
  artist: string,
  album: string,
  signal?: AbortSignal
): Promise<string | null> {
  const key = `${CACHE_PREFIX}${artist}::${track}`
  const cached = localStorage.getItem(key)
  if (cached !== null) return cached || null

  const ctrl = signal ? null : new AbortController()
  const sig = signal ?? ctrl!.signal

  try {
    // Fire both in parallel — album-matched is preferred for precision, but both resolve
    // in one round-trip instead of sequentially retrying on a 404.
    const [withAlbum, withoutAlbum] = await Promise.all([
      lrclibGet({ track_name: track, artist_name: artist, album_name: album }, sig),
      lrclibGet({ track_name: track, artist_name: artist }, sig),
    ])
    const lyrics = withAlbum ?? withoutAlbum
    localStorage.setItem(key, lyrics ?? '')
    return lyrics
  } catch (e) {
    if (e instanceof DOMException && e.name === 'AbortError') throw e
    return null
  }
}
