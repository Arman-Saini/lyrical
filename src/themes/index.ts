import type { Theme } from '../types'
import { themes } from './definitions'

export const THEMES: Theme[] = themes

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

// ── Mixer ─────────────────────────────────────────────────────────────────────

export interface Mixer {
  displayFont: 'playfair' | 'bebas' | 'fraunces' | 'cormorant' | 'space-grotesk' | 'syne'
  bodyFont: 'dm-mono' | 'space-mono' | 'inter' | 'jetbrains-mono' | 'ibm-plex-mono'
  accentColor: string
  bgColor: string
  effects: string[]  // 'glass' | 'neon'
}

const DISPLAY_FONTS: Record<Mixer['displayFont'], string> = {
  playfair:       "'Playfair Display', Georgia, serif",
  bebas:          "'Bebas Neue', 'Arial Black', sans-serif",
  fraunces:       "'Fraunces', Georgia, serif",
  cormorant:      "'Cormorant Garamond', Georgia, serif",
  'space-grotesk': "'Space Grotesk', system-ui, sans-serif",
  syne:           "'Syne', system-ui, sans-serif",
}

const BODY_FONTS: Record<Mixer['bodyFont'], string> = {
  'dm-mono':        "'DM Mono', 'Courier New', monospace",
  'space-mono':     "'Space Mono', 'Courier New', monospace",
  inter:            "'Inter', system-ui, sans-serif",
  'jetbrains-mono': "'JetBrains Mono', 'Courier New', monospace",
  'ibm-plex-mono':  "'IBM Plex Mono', 'Courier New', monospace",
}

export function applyMixer(mixer: Partial<Mixer>): void {
  const root = document.documentElement
  if (mixer.accentColor) {
    root.style.setProperty('--accent', mixer.accentColor)
    root.style.setProperty('--accent-2', mixer.accentColor)
  }
  if (mixer.bgColor) root.style.setProperty('--bg', mixer.bgColor)
  if (mixer.displayFont) root.style.setProperty('--font-display', DISPLAY_FONTS[mixer.displayFont])
  if (mixer.bodyFont) root.style.setProperty('--font-body', BODY_FONTS[mixer.bodyFont])
  if (mixer.effects) document.body.setAttribute('data-effects', mixer.effects.join(' '))
}

export function saveMixer(mixer: Partial<Mixer>): void {
  localStorage.setItem('lyrical_mixer', JSON.stringify(mixer))
}

export function loadMixer(): Partial<Mixer> {
  try {
    const raw = localStorage.getItem('lyrical_mixer')
    return raw ? (JSON.parse(raw) as Partial<Mixer>) : {}
  } catch {
    return {}
  }
}

// ── Theme application ─────────────────────────────────────────────────────────

export function applyTheme(id: string): void {
  const theme = getTheme(id)
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  document.body.setAttribute('data-theme', id)
  document.body.setAttribute('data-scanlines', String(!!theme.scanlines))
  // Re-apply mixer overrides on top of the preset
  applyMixer(loadMixer())
}
