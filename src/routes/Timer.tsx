import { useEffect } from 'react'
import { useStore } from '../store/index'
import { applyTheme } from '../themes/index'
import Clock from '../components/Clock/Clock'
import PomodoroTimer from '../components/PomodoroTimer/PomodoroTimer'
import BackgroundLayer from '../components/BackgroundLayer/BackgroundLayer'
import styles from './Timer.module.css'

export default function Timer() {
  const { theme } = useStore()
  useEffect(() => { applyTheme(theme) }, [theme])

  return (
    <div className={styles.page}>
      <BackgroundLayer />
      <div className={styles.content}>
        <Clock />
        <PomodoroTimer />
      </div>
    </div>
  )
}
