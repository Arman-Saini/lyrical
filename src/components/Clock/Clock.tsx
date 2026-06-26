import { useState, useEffect, useRef } from 'react'
import styles from './Clock.module.css'

type Mode = 'clock' | 'stopwatch' | 'timer'

function pad(n: number) { return n.toString().padStart(2, '0') }

function getInitDuration(): number {
  const s = localStorage.getItem('lyrical_timer_dur')
  return s ? parseInt(s) : 25 * 60 * 1000
}

export default function Clock() {
  const [mode, setMode] = useState<Mode>(() =>
    (localStorage.getItem('lyrical_clock_mode') as Mode) ?? 'clock'
  )
  const [hidden, setHidden] = useState(() =>
    localStorage.getItem('lyrical_clock_hidden') === 'true'
  )

  // ── Wall clock ─────────────────────────────────────────────────────────────
  const [now, setNow] = useState(new Date())

  // ── Stopwatch ──────────────────────────────────────────────────────────────
  const [swMs, setSwMs] = useState(0)
  const [swRunning, setSwRunning] = useState(false)
  const swTickRef = useRef(0)

  // ── Timer ──────────────────────────────────────────────────────────────────
  const [timerDuration, setTimerDuration] = useState(getInitDuration)
  const [timerMs, setTimerMs] = useState(getInitDuration)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerDone, setTimerDone] = useState(false)
  const timerTickRef = useRef(0)

  const initDur = getInitDuration()
  const [durH, setDurH] = useState(() => Math.floor(initDur / 3_600_000))
  const [durM, setDurM] = useState(() => Math.floor((initDur % 3_600_000) / 60_000))
  const [durS, setDurS] = useState(() => Math.floor((initDur % 60_000) / 1000))

  // ── Ticks ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!swRunning) return
    swTickRef.current = Date.now()
    const id = setInterval(() => {
      const t = Date.now()
      setSwMs(ms => ms + t - swTickRef.current)
      swTickRef.current = t
    }, 50)
    return () => clearInterval(id)
  }, [swRunning])

  useEffect(() => {
    if (!timerRunning) return
    timerTickRef.current = Date.now()
    const id = setInterval(() => {
      const t = Date.now()
      const delta = t - timerTickRef.current
      timerTickRef.current = t
      setTimerMs(ms => {
        const next = ms - delta
        if (next <= 0) { setTimerRunning(false); setTimerDone(true); return 0 }
        return next
      })
    }, 50)
    return () => clearInterval(id)
  }, [timerRunning])

  // ── Handlers ───────────────────────────────────────────────────────────────
  function switchMode(m: Mode) {
    setMode(m)
    localStorage.setItem('lyrical_clock_mode', m)
  }

  function hide() {
    setHidden(true)
    localStorage.setItem('lyrical_clock_hidden', 'true')
  }

  function show() {
    setHidden(false)
    localStorage.removeItem('lyrical_clock_hidden')
  }

  function applyDuration() {
    const ms = (durH * 3600 + durM * 60 + durS) * 1000
    if (ms <= 0) return
    localStorage.setItem('lyrical_timer_dur', ms.toString())
    setTimerDuration(ms)
    setTimerMs(ms)
    setTimerRunning(false)
    setTimerDone(false)
  }

  function timerReset() {
    setTimerRunning(false)
    setTimerDone(false)
    setTimerMs(timerDuration)
  }

  function timerToggle() {
    if (timerDone) return
    setTimerRunning(r => !r)
  }

  function timerLabel() {
    if (timerDone) return 'done'
    if (timerRunning) return 'pause'
    if (timerMs === timerDuration) return 'start'
    return 'resume'
  }

  // ── Display values ─────────────────────────────────────────────────────────
  let main: string, sub: string

  if (mode === 'clock') {
    main = `${pad(now.getHours())}:${pad(now.getMinutes())}`
    sub = pad(now.getSeconds())
  } else if (mode === 'stopwatch') {
    const h = Math.floor(swMs / 3_600_000)
    const m = Math.floor((swMs % 3_600_000) / 60_000)
    const s = Math.floor((swMs % 60_000) / 1000)
    const cs = Math.floor((swMs % 1000) / 10)
    main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
    sub = pad(cs)
  } else {
    const h = Math.floor(timerMs / 3_600_000)
    const m = Math.floor((timerMs % 3_600_000) / 60_000)
    const s = Math.floor((timerMs % 60_000) / 1000)
    main = h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
    sub = ''
  }

  // ── Hidden state ───────────────────────────────────────────────────────────
  if (hidden) {
    return (
      <button className={styles.showBtn} onClick={show}>
        show clock
      </button>
    )
  }

  return (
    <div className={styles.root}>
      {/* ── Time display ── */}
      <div className={styles.clock}>
        <span className={`${styles.time} ${mode === 'timer' && timerDone ? styles.done : ''}`}>
          {main}
        </span>
        {sub && <span className={styles.seconds}>{sub}</span>}
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Mode switcher + hide */}
        <div className={styles.modeRow}>
          {(['clock', 'stopwatch', 'timer'] as Mode[]).map(m => (
            <button
              key={m}
              className={`${styles.modeBtn} ${mode === m ? styles.modeBtnActive : ''}`}
              onClick={() => switchMode(m)}
            >
              {m}
            </button>
          ))}
          <button className={styles.hideBtn} onClick={hide}>hide</button>
        </div>

        {/* Stopwatch controls */}
        {mode === 'stopwatch' && (
          <div className={styles.actionRow}>
            <button className={styles.actionBtn} onClick={() => setSwRunning(r => !r)}>
              {swRunning ? 'pause' : swMs > 0 ? 'resume' : 'start'}
            </button>
            <button className={styles.actionBtn} onClick={() => { setSwRunning(false); setSwMs(0) }}>
              reset
            </button>
          </div>
        )}

        {/* Timer controls */}
        {mode === 'timer' && (
          <div className={styles.timerControls}>
            <div className={styles.actionRow}>
              <button
                className={styles.actionBtn}
                onClick={timerToggle}
                disabled={timerDone}
              >
                {timerLabel()}
              </button>
              <button className={styles.actionBtn} onClick={timerReset}>
                reset
              </button>
            </div>
            {/* Duration input — only when timer is stopped */}
            {!timerRunning && (
              <div className={styles.durationRow}>
                <input
                  type="number" className={styles.durInput}
                  value={durH} min={0} max={23}
                  onChange={e => setDurH(Math.max(0, parseInt(e.target.value) || 0))}
                />
                <span className={styles.durSep}>h</span>
                <input
                  type="number" className={styles.durInput}
                  value={durM} min={0} max={59}
                  onChange={e => setDurM(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
                <span className={styles.durSep}>m</span>
                <input
                  type="number" className={styles.durInput}
                  value={durS} min={0} max={59}
                  onChange={e => setDurS(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
                />
                <span className={styles.durSep}>s</span>
                <button className={styles.setBtn} onClick={applyDuration}>set</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
