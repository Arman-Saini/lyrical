import { useEffect, useRef, useState } from 'react'
import { useStore } from '../store/index'
import { initiateAuth, isAuthenticated, logout } from '../spotify/auth'
import { startPolling } from '../spotify/player'
import { fetchLyrics } from '../lyrics/lrclib'
import { parseLRC } from '../lyrics/parser'
import { loadCustomLyrics, saveCustomLyrics } from '../lyrics/custom'
import { applyTheme } from '../themes/index'
import ThemePicker from '../components/ThemePicker/ThemePicker'
import BackgroundManager from '../components/BackgroundManager/BackgroundManager'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Hub.module.css'

export default function Hub() {
  const store = useStore()
  const [authed, setAuthed] = useState(isAuthenticated())
  const [status, setStatus] = useState('Idle')
  const [customLrcText, setCustomLrcText] = useState('')
  const stopRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    applyTheme(store.theme)
  }, [store.theme])

  useEffect(() => {
    if (!authed) return

    stopRef.current = startPolling(
      async (track) => {
        store.setTrack(track)
        setStatus(`Playing: ${track.name} — ${track.artist}`)

        const custom = loadCustomLyrics(track.artist, track.name)
        if (custom) { store.setLyrics(parseLRC(custom)); return }

        const lrc = await fetchLyrics(track.name, track.artist, track.album)
        store.setLyrics(lrc ? parseLRC(lrc) : [])
      },
      (ms) => store.setProgressMs(ms)
    )

    return () => stopRef.current?.()
  }, [authed])

  function handleLrcFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      if (store.track) {
        store.setLyrics(parseLRC(text))
        setStatus('Manual LRC file loaded')
      }
    }
    reader.readAsText(file)
  }

  function handleSaveCustom() {
    if (!store.track || !customLrcText.trim()) return
    saveCustomLyrics(store.track.artist, store.track.name, customLrcText)
    store.setLyrics(parseLRC(customLrcText))
    setStatus('Custom lyrics saved')
    setCustomLrcText('')
  }

  return (
    <div className={styles.page}>
      <BackgroundLayer />
      <div className={styles.content}>
        <h1 className={styles.title}>Lyrical</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Spotify</h2>
          {authed ? (
            <div className={styles.row}>
              <span className={styles.connected}>Connected</span>
              <span className={styles.status}>{status}</span>
              <button className={styles.btnDanger} onClick={() => { logout(); setAuthed(false) }}>Disconnect</button>
            </div>
          ) : (
            <button className={styles.btn} onClick={() => initiateAuth()}>Connect Spotify</button>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Open Views</h2>
          <div className={styles.row}>
            {['/lyrics', '/art', '/timer'].map(path => (
              <button key={path} className={styles.btn}
                onClick={() => window.open(path, '_blank')}>
                Open {path.slice(1).charAt(0).toUpperCase() + path.slice(2)}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Load Lyrics</h2>
          <div className={styles.row}>
            <label className={styles.btn} style={{ cursor: 'pointer' }}>
              Load .lrc file
              <input type="file" accept=".lrc,.txt" style={{ display: 'none' }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleLrcFile(f) }} />
            </label>
          </div>
          <textarea
            className={styles.textarea}
            placeholder={`Paste custom lyrics for: ${store.track ? `${store.track.artist} — ${store.track.name}` : 'connect Spotify first'}`}
            value={customLrcText}
            onChange={e => setCustomLrcText(e.target.value)}
          />
          <button className={styles.btn} onClick={handleSaveCustom}
            disabled={!store.track || !customLrcText.trim()}>
            Save custom lyrics
          </button>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Theme</h2>
          <ThemePicker activeTheme={store.theme} onChange={store.setTheme} />
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Background</h2>
          <BackgroundManager />
        </section>
      </div>
    </div>
  )
}
