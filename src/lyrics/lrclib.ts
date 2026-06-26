export async function fetchLyrics(
  track: string,
  artist: string,
  album: string
): Promise<string | null> {
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
    return data.syncedLyrics ?? data.plainLyrics ?? null
  } catch {
    return null
  }
}
