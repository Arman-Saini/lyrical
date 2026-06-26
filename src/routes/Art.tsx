import { useEffect } from 'react'
import { useStore } from '../store/index'
import { applyTheme } from '../themes/index'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Art.module.css'

export default function Art() {
  const { track, progressMs, theme } = useStore()

  useEffect(() => { applyTheme(theme) }, [theme])

  const progress = track ? progressMs / track.durationMs : 0

  return (
    <div className={styles.page}>
      <BackgroundLayer />
      {track?.artUrl && (
        <div
          className={styles.ambientBg}
          style={{ backgroundImage: `url(${track.artUrl})` }}
        />
      )}
      <div className={styles.content}>
        {track ? (
          <>
            <div className={styles.artWrap}>
              <img
                className={styles.art}
                src={track.artUrl}
                alt={`${track.album} cover`}
                key={track.id}
              />
            </div>
            <div className={styles.info}>
              <div className={styles.trackName}>{track.name}</div>
              <div className={styles.artist}>{track.artist}</div>
              <div className={styles.album}>{track.album}</div>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
            </div>
            <div className={styles.times}>
              <span>{formatMs(progressMs)}</span>
              <span>{formatMs(track.durationMs)}</span>
            </div>
          </>
        ) : (
          <div className={styles.empty}>Open Hub to connect Spotify</div>
        )}
      </div>
    </div>
  )
}

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
