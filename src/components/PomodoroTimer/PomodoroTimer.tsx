import { useEffect, useRef } from 'react'
import { useStore } from '../../store/index'
import { nextPhase, phaseLabel } from './timerLogic'
import styles from './PomodoroTimer.module.css'

export default function PomodoroTimer() {
  const { timerState, setTimerState } = useStore()
  const ownerRef = useRef(false)

  useEffect(() => {
    ownerRef.current = true
    return () => { ownerRef.current = false }
  }, [])

  useEffect(() => {
    if (!timerState.running || !ownerRef.current) return

    const id = setInterval(() => {
      const remaining = timerState.remainingMs - 1000
      if (remaining <= 0) {
        const { phase, remainingMs, cycleCount } = nextPhase(
          timerState.phase, timerState.cycleCount,
          timerState.workMs, timerState.breakMs, timerState.longBreakMs
        )
        setTimerState({ phase, remainingMs, cycleCount, running: false })
        if (Notification.permission === 'granted') {
          new Notification(`Lyrical — ${phaseLabel(phase)} started`)
        }
      } else {
        setTimerState({ remainingMs: remaining })
      }
    }, 1000)

    return () => clearInterval(id)
  }, [timerState.running, timerState.remainingMs, timerState.phase])

  useEffect(() => {
    Notification.requestPermission()
  }, [])

  function toggleTimer() {
    setTimerState({ running: !timerState.running })
  }

  function resetTimer() {
    setTimerState({ running: false, remainingMs: timerState.workMs, phase: 'work', cycleCount: 0 })
  }

  const totalMs = timerState.phase === 'work' ? timerState.workMs
    : timerState.phase === 'break' ? timerState.breakMs : timerState.longBreakMs
  const progress = 1 - timerState.remainingMs / totalMs

  const rem = Math.ceil(timerState.remainingMs / 1000)
  const m = Math.floor(rem / 60).toString().padStart(2, '0')
  const s = (rem % 60).toString().padStart(2, '0')

  return (
    <div className={styles.container}>
      <div className={styles.phase}>{phaseLabel(timerState.phase)}</div>
      <div className={styles.ringWrap}>
        <svg className={styles.ring} viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="54" className={styles.track} />
          <circle
            cx="60" cy="60" r="54"
            className={styles.fill}
            strokeDasharray={`${2 * Math.PI * 54}`}
            strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress)}`}
          />
        </svg>
        <div className={styles.countdown}>{m}:{s}</div>
      </div>
      <div className={styles.controls}>
        <button className={styles.btn} onClick={toggleTimer}>
          {timerState.running ? 'Pause' : 'Start'}
        </button>
        <button className={styles.btnSecondary} onClick={resetTimer}>Reset</button>
      </div>
      <div className={styles.cycles}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={`${styles.dot} ${i < timerState.cycleCount % 4 ? styles.filled : ''}`} />
        ))}
      </div>
    </div>
  )
}
