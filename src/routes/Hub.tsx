import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store/index'
import { initiateAuth, isAuthenticated, logout } from '../spotify/auth'
import { startPolling } from '../spotify/player'
import { fetchLyrics } from '../lyrics/lrclib'
import { parseLRC } from '../lyrics/parser'
import { loadCustomLyrics, saveCustomLyrics } from '../lyrics/custom'
import { applyTheme, THEMES } from '../themes/index'
import { getEffectiveTheme } from '../themes/usePageTheme'
import ThemeCurator from '../components/ThemeCurator/ThemeCurator'
import BackgroundManager from '../components/BackgroundManager/BackgroundManager'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Hub.module.css'

// ── Now Playing API section ────────────────────────────────────────────────
function NowPlayingApiSection() {
  const [copied, setCopied] = useState(false)

  const copyToken = useCallback(() => {
    try {
      const raw = localStorage.getItem('lyrical_tokens')
      if (!raw) return
      const { refresh_token } = JSON.parse(raw) as { refresh_token?: string }
      if (!refresh_token) return
      navigator.clipboard.writeText(refresh_token).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    } catch { /* clipboard denied */ }
  }, [])

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Now Playing API</h2>
      <p className={styles.apiDesc}>
        Lets anyone see what you&apos;re listening to — no login required.
      </p>
      <div className={styles.row}>
        <code className={styles.apiEndpoint}>/api/now-playing</code>
        <button className={styles.btn} onClick={() => window.open('/now-playing', '_blank')}>
          Preview
        </button>
      </div>
      <div className={styles.apiSteps}>
        <div className={styles.apiStep}>
          <span className={styles.apiStepNum}>1</span>
          <button className={styles.btn} onClick={copyToken} disabled={copied}>
            {copied ? 'Copied!' : 'Copy refresh token'}
          </button>
          <span className={styles.apiStepNote}>must be connected to Spotify first</span>
        </div>
        <div className={styles.apiStep}>
          <span className={styles.apiStepNum}>2</span>
          <span className={styles.apiStepNote}>
            Paste as <code className={styles.apiCode}>SPOTIFY_REFRESH_TOKEN</code> in Vercel → Settings → Environment Variables
          </span>
        </div>
        <div className={styles.apiStep}>
          <span className={styles.apiStepNum}>3</span>
          <span className={styles.apiStepNote}>Redeploy — the endpoint goes live instantly</span>
        </div>
      </div>
    </section>
  )
}

// ──────────────────────────────────────────────────────────────────────────────

const PAGE_ROWS = [
  { id: 'hub',   label: 'Hub' },
  { id: 'lyrics', label: 'Lyrics' },
  { id: 'art',   label: 'Art' },
  { id: 'timer', label: 'Timer' },
]

export default function Hub() {
  const store = useStore()
  const [authed, setAuthed] = useState(isAuthenticated())
  const [customLrcText, setCustomLrcText] = useState('')
  const stopRef = useRef<(() => void) | null>(null)
  const fetchingTrackRef = useRef<string | null>(null)
  const fetchAbortRef = useRef<AbortController | null>(null)

  // ── Theme mode ─────────────────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState<'global' | 'per-page'>(() =>
    (localStorage.getItem('lyrical_theme_mode') as 'global' | 'per-page') ?? 'global'
  )
  const [pageThemes, setPageThemes] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('lyrical_page_themes') ?? '{}') } catch { return {} }
  })

  useEffect(() => {
    applyTheme(getEffectiveTheme('hub', store.theme))
  }, [store.theme, themeMode, pageThemes])

  function handleThemeMode(mode: 'global' | 'per-page') {
    setThemeMode(mode)
    localStorage.setItem('lyrical_theme_mode', mode)
  }

  function handlePageTheme(page: string, themeId: string) {
    const next = { ...pageThemes, [page]: themeId }
    setPageThemes(next)
    localStorage.setItem('lyrical_page_themes', JSON.stringify(next))
  }

  // ── Spotify polling ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return

    stopRef.current = startPolling(
      async (track) => {
        store.setTrack(track)

        if (fetchingTrackRef.current === track.id) return
        fetchingTrackRef.current = track.id

        fetchAbortRef.current?.abort()
        const ctrl = new AbortController()
        fetchAbortRef.current = ctrl

        store.setLyricsLoading(true)

        const custom = loadCustomLyrics(track.artist, track.name)
        if (custom) {
          store.setLyrics(parseLRC(custom))
          store.setLyricsLoading(false)
          return
        }

        try {
          const lrc = await fetchLyrics(track.name, track.artist, track.album, ctrl.signal)
          if (fetchingTrackRef.current !== track.id) return
          store.setLyrics(lrc ? parseLRC(lrc) : [])
          store.setLyricsLoading(false)
        } catch {
          // AbortError — a newer track took over, ignore
        }
      },
      (ms, isPlaying) => {
        store.setProgressMs(ms)
        store.setIsPlaying(isPlaying)
      }
    )

    return () => stopRef.current?.()
  }, [authed])

  function handleLrcFile(file: File) {
    const reader = new FileReader()
    reader.onload = e => {
      const text = e.target?.result as string
      if (store.track) {
        store.setLyrics(parseLRC(text))
      }
    }
    reader.readAsText(file)
  }

  function handleSaveCustom() {
    if (!store.track || !customLrcText.trim()) return
    saveCustomLyrics(store.track.artist, store.track.name, customLrcText)
    store.setLyrics(parseLRC(customLrcText))
    setCustomLrcText('')
  }

  const statusText = store.track
    ? `${store.track.name} — ${store.track.artist}`
    : 'Idle'

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
              <span className={styles.status}>{statusText}</span>
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

          {/* Mode toggle */}
          <div className={styles.themeModeRow}>
            <button
              className={`${styles.themeModeBtn} ${themeMode === 'global' ? styles.themeModeBtnActive : ''}`}
              onClick={() => handleThemeMode('global')}
            >
              Global
            </button>
            <span className={styles.themeModeSep}>·</span>
            <button
              className={`${styles.themeModeBtn} ${themeMode === 'per-page' ? styles.themeModeBtnActive : ''}`}
              onClick={() => handleThemeMode('per-page')}
            >
              Per Page
            </button>
          </div>

          {themeMode === 'global' ? (
            <ThemeCurator activeTheme={store.theme} onChange={store.setTheme} />
          ) : (
            <div className={styles.perPageGrid}>
              {PAGE_ROWS.map(({ id, label }) => {
                const active = pageThemes[id] ?? store.theme
                return (
                  <div key={id} className={styles.perPageRow}>
                    <span className={styles.perPageLabel}>{label}</span>
                    <div className={styles.themeChipRow}>
                      {THEMES.map(t => (
                        <button
                          key={t.id}
                          className={`${styles.themeChip} ${active === t.id ? styles.themeChipActive : ''}`}
                          style={{
                            '--chip-bg': t.vars['--bg'],
                            '--chip-accent': t.vars['--accent'],
                          } as React.CSSProperties}
                          onClick={() => handlePageTheme(id, t.id)}
                          title={t.label}
                          aria-label={t.label}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
              <p className={styles.perPageHint}>
                View windows pick up changes live via localStorage.
              </p>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Background</h2>
          <BackgroundManager />
        </section>

        <NowPlayingApiSection />
      </div>
      {/* Marquee ticker — visible only in Chaos Theory / Warm Brutalist via CSS */}
      <div className={styles.ticker} aria-hidden="true">
        <span className={styles.tickerTrack}>
          {'LYRICAL · MUSIC · SOUND · RHYTHM · BEATS · MELODY · LYRICS · WAVE · SYNC · ARTIST · ALBUM · TRACK · FLOW · '.repeat(4)}
        </span>
      </div>
    </div>
  )
}
