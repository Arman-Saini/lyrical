import { useEffect, useRef } from 'react'
import type { LyricLine } from '../../types'
import styles from './LyricsDisplay.module.css'

interface Props {
  lyrics: LyricLine[]
  activeIndex: number
  loading?: boolean
  noTrack?: boolean
}

function lineStyle(rel: number, isPast: boolean): React.CSSProperties {
  const dist = Math.abs(rel)
  const opacity = isPast
    ? Math.max(0.08, 0.55 - dist * 0.1)
    : Math.max(0.12, 0.65 - dist * 0.1)
  return { opacity }
}

export default function LyricsDisplay({ lyrics, activeIndex, loading, noTrack }: Props) {
  const activeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [activeIndex])

  if (loading) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyText}>Loading lyrics…</span>
      </div>
    )
  }

  if (!lyrics.length) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyText}>
          {noTrack ? 'Connect Spotify to see lyrics.' : 'No lyrics found for this track.'}
        </span>
      </div>
    )
  }

  return (
    <div className={styles.lines}>
      {lyrics.map((line, i) => {
        const rel = i - activeIndex
        const isActive = rel === 0
        const isPast = rel < 0
        return (
          <div
            key={`${line.timeMs}-${i}`}
            ref={isActive ? activeRef : null}
            className={`${styles.line} ${isActive ? styles.active : isPast ? styles.past : styles.future}`}
            style={isActive ? undefined : lineStyle(rel, isPast)}
          >
            {line.text}
          </div>
        )
      })}
    </div>
  )
}
