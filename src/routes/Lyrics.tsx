import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../store/index'
import { getActiveLyricIndex } from '../lyrics/sync'
import { usePageTheme } from '../themes/usePageTheme'
import LyricsDisplay from '../components/LyricsDisplay/LyricsDisplay'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Lyrics.module.css'

export default function Lyrics() {
  const store = useStore()
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)
  usePageTheme('lyrics', store.theme)

  useEffect(() => {
    function tick() {
      const s = useStore.getState()
      const elapsed = s.isPlaying ? Date.now() - s.lastProgressAt : 0
      const interpolated = s.progressMs + elapsed
      const idx = getActiveLyricIndex(s.lyrics, interpolated + s.syncNudgeMs)
      setActiveLyricIndex(idx)
    }
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '[') store.nudgeSyncMs(-500)
    if (e.key === ']') store.nudgeSyncMs(500)
  }, [store])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const artUrl = store.track?.artUrl

  return (
    <div className={styles.page}>
      {artUrl && (
        <div
          key={artUrl}
          className={styles.artBg}
          style={{ backgroundImage: `url(${artUrl})` }}
        />
      )}
      <BackgroundLayer />
      <div className={styles.content}>
        <LyricsDisplay
          lyrics={store.lyrics}
          activeIndex={activeLyricIndex}
          loading={store.lyricsLoading}
          noTrack={!store.track}
        />
      </div>
      {store.track && (
        <div className={styles.trackInfo}>
          <span className={styles.trackName}>{store.track.name}</span>
          <span className={styles.trackArtist}>{store.track.artist}</span>
        </div>
      )}
      {store.syncNudgeMs !== 0 && (
        <div className={styles.nudge}>
          Sync {store.syncNudgeMs > 0 ? '+' : ''}{store.syncNudgeMs}ms
        </div>
      )}
    </div>
  )
}
