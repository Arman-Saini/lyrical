import { useEffect, useState, useCallback } from 'react'
import { useStore } from '../store/index'
import { getActiveLyricIndex } from '../lyrics/sync'
import { applyTheme } from '../themes/index'
import LyricsDisplay from '../components/LyricsDisplay/LyricsDisplay'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Lyrics.module.css'

export default function Lyrics() {
  const store = useStore()
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)

  useEffect(() => { applyTheme(store.theme) }, [store.theme])

  // Interpolate progress locally so lyrics advance between 5-second Spotify polls
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

  return (
    <div className={styles.page}>
      <BackgroundLayer />
      <div className={styles.content}>
        <LyricsDisplay
          lyrics={store.lyrics}
          activeIndex={activeLyricIndex}
          artist={store.track?.artist ?? ''}
          trackName={store.track?.name ?? ''}
          loading={store.lyricsLoading}
        />
        {store.syncNudgeMs !== 0 && (
          <div className={styles.nudge}>
            Sync offset: {store.syncNudgeMs > 0 ? '+' : ''}{store.syncNudgeMs}ms
          </div>
        )}
      </div>
    </div>
  )
}
