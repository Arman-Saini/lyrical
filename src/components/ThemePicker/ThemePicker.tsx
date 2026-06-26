import { THEMES, applyTheme } from '../../themes/index'
import styles from './ThemePicker.module.css'

interface Props {
  activeTheme: string
  onChange: (id: string) => void
}

export default function ThemePicker({ activeTheme, onChange }: Props) {
  const categories = ['dark', 'light', 'special'] as const

  return (
    <div className={styles.container}>
      {categories.map(cat => (
        <div key={cat} className={styles.group}>
          <h3 className={styles.groupLabel}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
          <div className={styles.grid}>
            {THEMES.filter(t => t.category === cat).map(theme => (
              <button
                key={theme.id}
                className={`${styles.card} ${activeTheme === theme.id ? styles.active : ''}`}
                onClick={() => { applyTheme(theme.id); onChange(theme.id) }}
                title={theme.label}
              >
                <div
                  className={styles.preview}
                  style={{
                    background: theme.vars['--bg'],
                    borderColor: theme.vars['--accent'],
                  }}
                >
                  <div style={{ background: theme.vars['--accent'], borderRadius: 4, height: 8, width: '60%' }} />
                  <div style={{ background: theme.vars['--text-muted'], borderRadius: 2, height: 4, width: '80%', marginTop: 4 }} />
                  <div style={{ background: theme.vars['--text-muted'], borderRadius: 2, height: 4, width: '50%', marginTop: 2 }} />
                </div>
                <span className={styles.name}>{theme.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
