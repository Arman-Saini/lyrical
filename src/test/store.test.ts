import { describe, it, expect, beforeEach } from 'vitest'
import { useStore } from '../store/index'

describe('Zustand store', () => {
  beforeEach(() => {
    useStore.setState({
      track: null, progressMs: 0, syncNudgeMs: 0, lyrics: [],
      activeLyricIndex: -1, theme: 'midnight', background: 'theme-default',
      overlayOpacity: 0.5,
      timerState: { phase: 'work', remainingMs: 25 * 60 * 1000, running: false, cycleCount: 0, workMs: 25 * 60 * 1000, breakMs: 5 * 60 * 1000, longBreakMs: 15 * 60 * 1000 }
    })
  })

  it('initial theme is midnight', () => {
    expect(useStore.getState().theme).toBe('midnight')
  })

  it('setTheme updates theme', () => {
    useStore.getState().setTheme('dracula')
    expect(useStore.getState().theme).toBe('dracula')
  })

  it('setTrack updates track', () => {
    const track = { id: '1', name: 'Test', artist: 'Artist', album: 'Album', artUrl: '', durationMs: 200000 }
    useStore.getState().setTrack(track)
    expect(useStore.getState().track?.name).toBe('Test')
  })

  it('nudgeSyncMs adds to syncNudgeMs', () => {
    useStore.getState().nudgeSyncMs(500)
    expect(useStore.getState().syncNudgeMs).toBe(500)
    useStore.getState().nudgeSyncMs(-500)
    expect(useStore.getState().syncNudgeMs).toBe(0)
  })

  it('setTimerState merges partial updates', () => {
    useStore.getState().setTimerState({ running: true })
    expect(useStore.getState().timerState.running).toBe(true)
    expect(useStore.getState().timerState.phase).toBe('work')
  })
})
