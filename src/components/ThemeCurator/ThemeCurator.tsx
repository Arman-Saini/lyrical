import { useState } from 'react'
import { applyTheme, applyMixer, saveMixer, loadMixer } from '../../themes/index'
import type { Mixer } from '../../themes/index'
import styles from './ThemeCurator.module.css'

interface Props {
  activeTheme: string
  onChange: (id: string) => void
}

const PRESETS = [
  {
    id: 'editorial-noir',
    label: 'Editorial Noir',
    sub: 'Playfair · DM Mono',
    bg: '#0a0a0a',
    accent: '#c8b89a',
    text: '#f5f0e8',
    textMuted: '#6b6b6b',
    defaults: { displayFont: 'playfair', bodyFont: 'dm-mono', accentColor: '#c8b89a', bgColor: '#0a0a0a', effects: [] } as Mixer,
  },
  {
    id: 'chaos-theory',
    label: 'Chaos Theory',
    sub: 'Bebas Neue · Space Mono',
    bg: '#0e0e0e',
    accent: '#ff2d55',
    text: '#f5f0e8',
    textMuted: '#888888',
    defaults: { displayFont: 'bebas', bodyFont: 'space-mono', accentColor: '#ff2d55', bgColor: '#0e0e0e', effects: [] } as Mixer,
  },
  {
    id: 'organic-cream',
    label: 'Organic Cream',
    sub: 'Cormorant · Inter',
    bg: '#f7f3ec',
    accent: '#d4a853',
    text: '#2c1810',
    textMuted: '#8b6f47',
    defaults: { displayFont: 'cormorant', bodyFont: 'inter', accentColor: '#d4a853', bgColor: '#f7f3ec', effects: [] } as Mixer,
  },
  {
    id: 'cyber-minimal',
    label: 'Cyber Minimal',
    sub: 'Space Grotesk · JetBrains',
    bg: '#070a0f',
    accent: '#00d4ff',
    text: '#e8edf5',
    textMuted: '#6b7280',
    defaults: { displayFont: 'space-grotesk', bodyFont: 'jetbrains-mono', accentColor: '#00d4ff', bgColor: '#070a0f', effects: ['glass'] } as Mixer,
  },
  {
    id: 'warm-brutalist',
    label: 'Warm Brutalist',
    sub: 'Syne · IBM Plex Mono',
    bg: '#fffbf0',
    accent: '#ff6b35',
    text: '#1a1a1a',
    textMuted: '#555555',
    defaults: { displayFont: 'syne', bodyFont: 'ibm-plex-mono', accentColor: '#ff6b35', bgColor: '#fffbf0', effects: [] } as Mixer,
  },
]

const DISPLAY_FONTS: { id: Mixer['displayFont']; label: string; sample: string }[] = [
  { id: 'playfair',       label: 'Playfair',      sample: "'Playfair Display', serif" },
  { id: 'bebas',          label: 'Bebas Neue',    sample: "'Bebas Neue', sans-serif" },
  { id: 'fraunces',       label: 'Fraunces',      sample: "'Fraunces', serif" },
  { id: 'cormorant',      label: 'Cormorant',     sample: "'Cormorant Garamond', serif" },
  { id: 'space-grotesk',  label: 'Space Grotesk', sample: "'Space Grotesk', sans-serif" },
  { id: 'syne',           label: 'Syne',          sample: "'Syne', sans-serif" },
]

const BODY_FONTS: { id: Mixer['bodyFont']; label: string }[] = [
  { id: 'dm-mono',        label: 'DM Mono' },
  { id: 'space-mono',     label: 'Space Mono' },
  { id: 'inter',          label: 'Inter' },
  { id: 'jetbrains-mono', label: 'JetBrains' },
  { id: 'ibm-plex-mono',  label: 'IBM Plex' },
]

const ACCENT_SWATCHES = [
  '#c8b89a', '#ff2d55', '#c8ff00', '#00d4ff', '#ff6b35', '#d4a853',
]

const BG_SWATCHES = [
  '#0a0a0a', '#0e0e0e', '#070a0f', '#f7f3ec', '#fffbf0',
]

const EFFECTS: { id: string; label: string }[] = [
  { id: 'glass', label: 'Glass Blur' },
  { id: 'neon',  label: 'Neon Glow' },
]

function initMixer(activeTheme: string): Mixer {
  const saved = loadMixer()
  const preset = PRESETS.find(p => p.id === activeTheme)?.defaults
  return {
    displayFont: (saved.displayFont ?? preset?.displayFont ?? 'playfair') as Mixer['displayFont'],
    bodyFont:    (saved.bodyFont    ?? preset?.bodyFont    ?? 'dm-mono')   as Mixer['bodyFont'],
    accentColor: saved.accentColor ?? preset?.accentColor ?? '#c8b89a',
    bgColor:     saved.bgColor     ?? preset?.bgColor     ?? '#0a0a0a',
    effects:     saved.effects     ?? preset?.effects     ?? [],
  }
}

export default function ThemeCurator({ activeTheme, onChange }: Props) {
  const [mixer, setMixer] = useState<Mixer>(() => initMixer(activeTheme))

  function handlePreset(presetId: string) {
    const preset = PRESETS.find(p => p.id === presetId)!
    const newMixer = { ...preset.defaults }
    setMixer(newMixer)
    saveMixer(newMixer)
    onChange(presetId)
    applyTheme(presetId)
  }

  function update(partial: Partial<Mixer>) {
    const next = { ...mixer, ...partial }
    setMixer(next)
    saveMixer(next)
    applyMixer(partial)
  }

  function toggleEffect(id: string) {
    const effects = mixer.effects.includes(id)
      ? mixer.effects.filter(e => e !== id)
      : [...mixer.effects, id]
    update({ effects })
  }

  return (
    <div className={styles.container}>
      {/* ── Presets ── */}
      <div className={styles.presets}>
        {PRESETS.map(p => (
          <button
            key={p.id}
            className={`${styles.preset} ${activeTheme === p.id ? styles.presetActive : ''}`}
            style={{ '--p-bg': p.bg, '--p-accent': p.accent, '--p-text': p.text, '--p-text-muted': p.textMuted } as React.CSSProperties}
            onClick={() => handlePreset(p.id)}
          >
            <span className={styles.presetName}>{p.label}</span>
            <span className={styles.presetSub}>{p.sub}</span>
          </button>
        ))}
      </div>

      <div className={styles.rule} />

      {/* ── Mixer ── */}
      <div className={styles.mixer}>

        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.label}>Display Font</div>
            <div className={styles.chipRow}>
              {DISPLAY_FONTS.map(f => (
                <button
                  key={f.id}
                  className={`${styles.chip} ${mixer.displayFont === f.id ? styles.chipActive : ''}`}
                  style={{ fontFamily: f.sample }}
                  onClick={() => update({ displayFont: f.id })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.label}>Body Text</div>
            <div className={styles.chipRow}>
              {BODY_FONTS.map(f => (
                <button
                  key={f.id}
                  className={`${styles.chip} ${mixer.bodyFont === f.id ? styles.chipActive : ''}`}
                  onClick={() => update({ bodyFont: f.id })}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.col}>
            <div className={styles.label}>Accent Color</div>
            <div className={styles.swatchRow}>
              {ACCENT_SWATCHES.map(c => (
                <button
                  key={c}
                  className={`${styles.swatch} ${mixer.accentColor === c ? styles.swatchActive : ''}`}
                  style={{ background: c }}
                  onClick={() => update({ accentColor: c })}
                  title={c}
                />
              ))}
              <input
                type="color"
                className={styles.colorInput}
                value={mixer.accentColor}
                onChange={e => update({ accentColor: e.target.value })}
                title="Custom"
              />
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.label}>Background</div>
            <div className={styles.swatchRow}>
              {BG_SWATCHES.map(c => (
                <button
                  key={c}
                  className={`${styles.swatch} ${mixer.bgColor === c ? styles.swatchActive : ''}`}
                  style={{ background: c, border: '1px solid #444' }}
                  onClick={() => update({ bgColor: c })}
                  title={c}
                />
              ))}
              <input
                type="color"
                className={styles.colorInput}
                value={mixer.bgColor}
                onChange={e => update({ bgColor: e.target.value })}
                title="Custom"
              />
            </div>
          </div>
        </div>

        <div className={styles.col}>
          <div className={styles.label}>Effects</div>
          <div className={styles.chipRow}>
            {EFFECTS.map(e => (
              <button
                key={e.id}
                className={`${styles.chip} ${mixer.effects.includes(e.id) ? styles.chipActive : ''}`}
                onClick={() => toggleEffect(e.id)}
              >
                {e.label}
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
