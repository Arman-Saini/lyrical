import { useState } from 'react'
import { useStore } from '../store/index'
import { usePageTheme } from '../themes/usePageTheme'
import Clock from '../components/Clock/Clock'
import PomodoroTimer from '../components/PomodoroTimer/PomodoroTimer'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Timer.module.css'

export default function Timer() {
  const { theme } = useStore()
  usePageTheme('timer', theme)

  const [showPomodoro, setShowPomodoro] = useState(
    () => localStorage.getItem('lyrical_show_pomodoro') === 'true'
  )

  function togglePomodoro() {
    const next = !showPomodoro
    setShowPomodoro(next)
    localStorage.setItem('lyrical_show_pomodoro', String(next))
  }

  return (
    <div className={styles.page}>
      <BackgroundLayer />
      <div className={styles.content}>
        <Clock />
        <button className={styles.pomodoroToggle} onClick={togglePomodoro}>
          {showPomodoro ? 'hide pomodoro' : 'pomodoro'}
        </button>
        {showPomodoro && <PomodoroTimer />}
      </div>
    </div>
  )
}
