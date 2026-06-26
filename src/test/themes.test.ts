import { describe, it, expect } from 'vitest'
import { THEMES, getTheme } from '../themes/index'

describe('Theme system', () => {
  it('exports 22 themes', () => {
    expect(THEMES).toHaveLength(22)
  })

  it('every theme has required CSS vars', () => {
    const required = ['--bg', '--surface', '--surface-2', '--accent', '--text', '--text-muted', '--border', '--font-display', '--font-body', '--radius']
    THEMES.forEach(theme => {
      required.forEach(key => {
        expect(theme.vars).toHaveProperty(key)
      })
    })
  })

  it('getTheme returns correct theme by id', () => {
    const t = getTheme('midnight')
    expect(t.id).toBe('midnight')
    expect(t.vars['--bg']).toBe('#0a0a0f')
  })

  it('getTheme falls back to midnight for unknown id', () => {
    const t = getTheme('nonexistent')
    expect(t.id).toBe('midnight')
  })
})
