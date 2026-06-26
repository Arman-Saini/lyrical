import { useState, useEffect } from 'react'
import styles from './Clock.module.css'

export default function Clock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const h = time.getHours().toString().padStart(2, '0')
  const m = time.getMinutes().toString().padStart(2, '0')
  const s = time.getSeconds().toString().padStart(2, '0')

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{h}:{m}</span>
      <span className={styles.seconds}>{s}</span>
    </div>
  )
}
