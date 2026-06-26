import { useEffect, useRef } from 'react'
import type { LyricLine } from '../../types'
import styles from './LyricsDisplay.module.css'

interface Props {
  lyrics: LyricLine[]
  activeIndex: number
  artist: string
  trackName: string
  loading?: boolean
}

export default function LyricsDisplay({ lyrics, activeIndex, artist, trackName, loading }: Props) {
  const activeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  if (loading) {
    return (
      <div className={styles.empty}>
        <p>Loading lyrics…</p>
      </div>
    )
  }

  if (!lyrics.length) {
    return (
      <div className={styles.empty}>
        <p>{trackName ? 'No lyrics found for this track.' : 'Connect Spotify to load lyrics.'}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.track}>{trackName}</span>
        <span className={styles.artist}>{artist}</span>
      </div>
      <div className={styles.lines}>
        {lyrics.map((line, i) => {
          const rel = i - activeIndex
          const isActive = rel === 0
          const isPast = rel < 0
          return (
            <div
              key={`${line.timeMs}-${i}`}
              ref={isActive ? activeRef : null}
              className={`${styles.line} ${isActive ? styles.active : ''} ${isPast ? styles.past : ''} ${rel > 0 ? styles.future : ''}`}
            >
              {line.text}
            </div>
          )
        })}
      </div>
    </div>
  )
}
