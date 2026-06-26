import { create } from 'zustand'
import type { Track, LyricLine, TimerState, AppState } from '../types'

const DEFAULT_TIMER: TimerState = {
  phase: 'work',
  remainingMs: 25 * 60 * 1000,
  running: false,
  cycleCount: 0,
  workMs: 25 * 60 * 1000,
  breakMs: 5 * 60 * 1000,
  longBreakMs: 15 * 60 * 1000,
}

interface Store extends AppState {
  lyricsLoading: boolean
  lastProgressAt: number
  setTrack: (track: Track | null) => void
  setProgressMs: (ms: number) => void
  setIsPlaying: (isPlaying: boolean) => void
  nudgeSyncMs: (delta: number) => void
  setLyrics: (lyrics: LyricLine[]) => void
  setLyricsLoading: (loading: boolean) => void
  setActiveLyricIndex: (index: number) => void
  setTheme: (theme: string) => void
  setBackground: (bg: AppState['background']) => void
  setOverlayOpacity: (opacity: number) => void
  setTimerState: (partial: Partial<TimerState>) => void
}

const savedTheme = localStorage.getItem('lyrical_theme') ?? 'midnight'

export const useStore = create<Store>((set) => ({
  track: null,
  progressMs: 0,
  isPlaying: false,
  syncNudgeMs: 0,
  lyrics: [],
  activeLyricIndex: -1,
  lyricsLoading: false,
  lastProgressAt: Date.now(),
  theme: savedTheme,
  background: 'theme-default',
  overlayOpacity: 0.5,
  timerState: DEFAULT_TIMER,

  setTrack: (track) => set({ track }),
  setProgressMs: (progressMs) => set({ progressMs, lastProgressAt: Date.now() }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  nudgeSyncMs: (delta) => set(s => ({ syncNudgeMs: s.syncNudgeMs + delta })),
  setLyrics: (lyrics) => set({ lyrics, activeLyricIndex: -1 }),
  setLyricsLoading: (lyricsLoading) => set({ lyricsLoading }),
  setActiveLyricIndex: (activeLyricIndex) => set({ activeLyricIndex }),
  setTheme: (theme) => {
    localStorage.setItem('lyrical_theme', theme)
    set({ theme })
  },
  setBackground: (background) => set({ background }),
  setOverlayOpacity: (overlayOpacity) => set({ overlayOpacity }),
  setTimerState: (partial) => set(s => ({ timerState: { ...s.timerState, ...partial } })),
}))
