import { useRef, useState, useEffect } from 'react'
import { saveBackground, loadBackground, deleteBackground } from '../../backgrounds/indexeddb'
import { useStore } from '../../store/index'
import styles from './BackgroundManager.module.css'

export default function BackgroundManager() {
  const { background, overlayOpacity, setBackground, setOverlayOpacity } = useStore()
  const [hasCustom, setHasCustom] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadBackground().then(b => setHasCustom(!!b))
  }, [])

  async function handleFile(file: File) {
    await saveBackground(file)
    setHasCustom(true)
    setBackground('custom')
  }

  async function handleRemove() {
    await deleteBackground()
    setHasCustom(false)
    setBackground('theme-default')
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.label}>Background</h3>
      <div className={styles.row}>
        <button className={styles.btn} onClick={() => inputRef.current?.click()}>
          {hasCustom ? 'Replace background' : 'Upload image / GIF'}
        </button>
        {hasCustom && (
          <button className={styles.btnDanger} onClick={handleRemove}>Remove</button>
        )}
        <button
          className={`${styles.btn} ${background === 'theme-default' ? styles.active : ''}`}
          onClick={() => setBackground('theme-default')}
        >
          Theme default
        </button>
        <button
          className={`${styles.btn} ${background === 'custom' && hasCustom ? styles.active : ''}`}
          onClick={() => hasCustom && setBackground('custom')}
          disabled={!hasCustom}
        >
          Custom
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.gif"
        style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />
      <div className={styles.overlayRow}>
        <label>Overlay opacity: {Math.round(overlayOpacity * 100)}%</label>
        <input
          type="range" min={0} max={0.9} step={0.05}
          value={overlayOpacity}
          onChange={e => setOverlayOpacity(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
