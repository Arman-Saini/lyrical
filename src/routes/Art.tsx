import { useEffect, useState } from 'react'
import { useStore } from '../store/index'
import { getActiveLyricIndex } from '../lyrics/sync'
import { usePageTheme } from '../themes/usePageTheme'
import LyricsDisplay from '../components/LyricsDisplay/LyricsDisplay'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Art.module.css'

export default function Art() {
  const store = useStore()
  const { track } = store
  usePageTheme('art', store.theme)

  const [interpolatedMs, setInterpolatedMs] = useState(0)
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1)
  const [showLyrics, setShowLyrics] = useState(
    () => localStorage.getItem('lyrical_art_lyrics') === 'true'
  )

  useEffect(() => {
    function tick() {
      const s = useStore.getState()
      const elapsed = s.isPlaying ? Date.now() - s.lastProgressAt : 0
      setInterpolatedMs(s.progressMs + elapsed)
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    function tick() {
      const s = useStore.getState()
      const elapsed = s.isPlaying ? Date.now() - s.lastProgressAt : 0
      const idx = getActiveLyricIndex(s.lyrics, s.progressMs + elapsed + s.syncNudgeMs)
      setActiveLyricIndex(idx)
    }
    tick()
    const id = setInterval(tick, 100)
    return () => clearInterval(id)
  }, [])

  function toggleLyrics() {
    const next = !showLyrics
    setShowLyrics(next)
    localStorage.setItem('lyrical_art_lyrics', String(next))
  }

  const progress = track ? Math.min(interpolatedMs / track.durationMs, 1) : 0
  const isSplit = showLyrics && !!track

  return (
    <div className={`${styles.page} ${isSplit ? styles.split : ''}`}>
      <BackgroundLayer />
      {track?.artUrl && (
        <div
          className={styles.ambientBg}
          style={{ backgroundImage: `url(${track.artUrl})` }}
        />
      )}

      <button className={styles.toggleBtn} onClick={toggleLyrics}>
        {showLyrics ? 'hide lyrics' : 'lyrics'}
      </button>

      {track ? (
        <>
          <div className={styles.artPanel}>
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
              <span>{formatMs(interpolatedMs)}</span>
              <span>{formatMs(track.durationMs)}</span>
            </div>
          </div>

          {isSplit && (
            <div className={styles.lyricsPanel}>
              <LyricsDisplay
                lyrics={store.lyrics}
                activeIndex={activeLyricIndex}
                loading={store.lyricsLoading}
                noTrack={false}
              />
            </div>
          )}
        </>
      ) : (
        <div className={styles.empty}>Open Hub to connect Spotify</div>
      )}
    </div>
  )
}

function formatMs(ms: number): string {
  const total = Math.floor(ms / 1000)
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
