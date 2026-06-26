export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')
  // Cache at the CDN edge for 15s — Spotify polls happen at most once per 15s
  res.setHeader('Cache-Control', 's-maxage=15, stale-while-revalidate=30')

  const clientId = process.env.VITE_SPOTIFY_CLIENT_ID
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN

  if (!clientId || !refreshToken) {
    return res.status(500).json({ error: 'Not configured' })
  }

  // Exchange refresh token for a fresh access token (PKCE — no client secret needed)
  const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  })

  if (!tokenRes.ok) {
    return res.status(502).json({ error: 'Token refresh failed' })
  }

  const { access_token } = await tokenRes.json()

  const npRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  // 204 = nothing playing
  if (npRes.status === 204) {
    return res.status(200).json({ isPlaying: false })
  }

  if (!npRes.ok) {
    return res.status(502).json({ error: 'Spotify API error' })
  }

  const data = await npRes.json()

  // Only expose tracks (not podcasts/ads)
  if (!data?.item || data.currently_playing_type !== 'track') {
    return res.status(200).json({ isPlaying: false })
  }

  return res.status(200).json({
    isPlaying: data.is_playing,
    track: data.item.name,
    artist: data.item.artists.map(a => a.name).join(', '),
    album: data.item.album.name,
    albumArt: data.item.album.images[0]?.url ?? null,
    progressMs: data.progress_ms,
    durationMs: data.item.duration_ms,
    spotifyUrl: data.item.external_urls.spotify,
  })
}
