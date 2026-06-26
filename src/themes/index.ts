import type { Theme } from '../types'
import { themes } from './definitions'

export const THEMES: Theme[] = themes

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}

export function applyTheme(id: string): void {
  const theme = getTheme(id)
  const root = document.documentElement
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value)
  })
  document.body.setAttribute('data-theme', id)
  document.body.setAttribute('data-scanlines', String(!!theme.scanlines))
}
