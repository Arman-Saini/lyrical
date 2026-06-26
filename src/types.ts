export interface Track {
  id: string
  name: string
  artist: string
  album: string
  artUrl: string
  durationMs: number
}

export interface LyricLine {
  timeMs: number
  text: string
}

export type TimerPhase = 'work' | 'break' | 'longBreak'

export interface TimerState {
  phase: TimerPhase
  remainingMs: number
  running: boolean
  cycleCount: number
  workMs: number
  breakMs: number
  longBreakMs: number
}

export interface Theme {
  id: string
  label: string
  category: 'dark' | 'light' | 'special'
  vars: {
    '--bg': string
    '--surface': string
    '--surface-2': string
    '--accent': string
    '--accent-2'?: string
    '--text': string
    '--text-muted': string
    '--border': string
    '--font-display': string
    '--font-body': string
    '--radius': string
    '--blur'?: string
  }
  scanlines?: boolean
}

export interface AppState {
  track: Track | null
  progressMs: number
  isPlaying: boolean
  syncNudgeMs: number
  lyrics: LyricLine[]
  activeLyricIndex: number
  theme: string
  background: 'theme-default' | 'custom'
  overlayOpacity: number
  timerState: TimerState
}
