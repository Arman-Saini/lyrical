const CACHE_PREFIX = 'lyrical_lrc::'

export async function fetchLyrics(
  track: string,
  artist: string,
  album: string
): Promise<string | null> {
  const key = `${CACHE_PREFIX}${artist}::${track}`
  const cached = localStorage.getItem(key)
  // '' means "previously fetched, no lyrics exist" — skip network call
  if (cached !== null) return cached || null

  const params = new URLSearchParams({
    track_name: track,
    artist_name: artist,
    album_name: album,
  })
  try {
    const res = await fetch(`https://lrclib.net/api/get?${params}`, {
      headers: { 'Lrclib-Client': 'Lyrical/1.0' }
    })
    if (!res.ok) return null
    const data = await res.json()
    const lyrics: string | null = data.syncedLyrics ?? data.plainLyrics ?? null
    localStorage.setItem(key, lyrics ?? '')
    return lyrics
  } catch {
    return null
  }
}
