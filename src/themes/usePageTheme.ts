import { useEffect } from 'react'
import { applyTheme } from './index'

export type PageName = 'hub' | 'lyrics' | 'art' | 'timer'

export function getEffectiveTheme(page: PageName, globalTheme: string): string {
  const mode = localStorage.getItem('lyrical_theme_mode') ?? 'global'
  if (mode === 'global') return globalTheme
  try {
    const pt = JSON.parse(localStorage.getItem('lyrical_page_themes') ?? '{}') as Record<string, string>
    return pt[page] ?? globalTheme
  } catch {
    return globalTheme
  }
}

export function usePageTheme(page: PageName, globalTheme: string): void {
  useEffect(() => {
    applyTheme(getEffectiveTheme(page, globalTheme))
  }, [page, globalTheme])

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === 'lyrical_theme_mode' || e.key === 'lyrical_page_themes' || e.key === 'lyrical_theme') {
        applyTheme(getEffectiveTheme(page, globalTheme))
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [page, globalTheme])
}
