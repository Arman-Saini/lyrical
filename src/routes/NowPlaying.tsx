import { useEffect, useState } from 'react'
import { applyTheme } from '../themes/index'
import styles from './NowPlaying.module.css'

interface NowPlayingData {
  isPlaying: boolean
  track?: string
  artist?: string
  album?: string
  albumArt?: string
  progressMs?: number
  durationMs?: number
  spotifyUrl?: string
}

function fmt(ms: number): string {
  const s = Math.floor(ms / 1000)
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`
}

export default function NowPlaying() {
  const [data, setData] = useState<NowPlayingData | null>(null)
  const [fetchedAt, setFetchedAt] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  // Always render in Editorial Noir — this is a public page
  useEffect(() => { applyTheme('editorial-noir') }, [])

  async function poll() {
    try {
      const res = await fetch('/api/now-playing')
      if (!res.ok) { setError(true); return }
      const json: NowPlayingData = await res.json()
      setData(json)
      setFetchedAt(Date.now())
      setProgress(json.isPlaying && json.durationMs
        ? (json.progressMs ?? 0) / json.durationMs
        : 0)
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  // Poll every 15 s (CDN caches, so actual Spotify calls are rate-limited)
  useEffect(() => {
    poll()
    const id = setInterval(poll, 15_000)
    return () => clearInterval(id)
  }, [])

  // Interpolate progress between API calls
  useEffect(() => {
    if (!data?.isPlaying || !data.durationMs) return
    const id = setInterval(() => {
      const elapsed = Date.now() - fetchedAt
      const current = (data.progressMs ?? 0) + elapsed
      setProgress(Math.min(current / data.durationMs!, 1))
    }, 500)
    return () => clearInterval(id)
  }, [data, fetchedAt])

  const bgStyle = data?.albumArt
    ? { backgroundImage: `url(${data.albumArt})` }
    : undefined

  return (
    <div className={styles.page}>
      {bgStyle && <div className={styles.ambientBg} style={bgStyle} />}

      {loading ? (
        <div className={styles.loading}><div className={styles.loadingDot} /></div>
      ) : error ? (
        <div className={styles.offline}>
          <span className={styles.offlineLabel}>Not configured</span>
        </div>
      ) : !data?.isPlaying ? (
        <div className={styles.offline}>
          <span className={styles.offlineLabel}>Not listening right now</span>
          <span className={styles.offlineSub}>Check back later</span>
        </div>
      ) : (
        <div className={styles.player}>
          <a
            href={data.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.artLink}
          >
            {data.albumArt && (
              <img
                className={styles.art}
                src={data.albumArt}
                alt={data.album}
                key={data.track}
              />
            )}
          </a>

          <div className={styles.info}>
            <div className={styles.liveTag}>
              <span className={styles.liveDot} />
              live
            </div>

            <a
              href={data.spotifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.trackLink}
            >
              <div className={styles.track}>{data.track}</div>
            </a>

            <div className={styles.artist}>{data.artist}</div>
            <div className={styles.album}>{data.album}</div>

            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
              </div>
              <div className={styles.times}>
                <span>{fmt((data.progressMs ?? 0) + (Date.now() - fetchedAt))}</span>
                <span>{fmt(data.durationMs ?? 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.footerText}>Lyrical</span>
      </div>
    </div>
  )
}
