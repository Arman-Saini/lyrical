import { describe, it, expect, beforeEach } from 'vitest'
import { buildMessage, applyMessage } from '../store/sync'
import { useStore } from '../store/index'

describe('BroadcastChannel sync', () => {
  beforeEach(() => {
    useStore.setState({ theme: 'midnight', track: null, progressMs: 0,
      syncNudgeMs: 0, lyrics: [], activeLyricIndex: -1,
      background: 'theme-default', overlayOpacity: 0.5,
      timerState: { phase: 'work', remainingMs: 1500000, running: false,
        cycleCount: 0, workMs: 1500000, breakMs: 300000, longBreakMs: 900000 } })
  })

  it('buildMessage captures current state snapshot', () => {
    useStore.getState().setTheme('dracula')
    const msg = buildMessage('test-origin')
    expect(msg.origin).toBe('test-origin')
    expect(msg.state.theme).toBe('dracula')
  })

  it('applyMessage updates store from incoming state', () => {
    applyMessage({ origin: 'other', state: { theme: 'tokyo-night', progressMs: 5000, track: null, syncNudgeMs: 0, lyrics: [], activeLyricIndex: -1, background: 'theme-default', overlayOpacity: 0.5, timerState: { phase: 'work', remainingMs: 1500000, running: false, cycleCount: 0, workMs: 1500000, breakMs: 300000, longBreakMs: 900000 } } })
    expect(useStore.getState().theme).toBe('tokyo-night')
    expect(useStore.getState().progressMs).toBe(5000)
  })

  it('applyMessage does not apply messages from own origin', () => {
    applyMessage({ origin: 'my-origin', state: { theme: 'matrix', progressMs: 0, track: null, syncNudgeMs: 0, lyrics: [], activeLyricIndex: -1, background: 'theme-default', overlayOpacity: 0.5, timerState: { phase: 'work', remainingMs: 1500000, running: false, cycleCount: 0, workMs: 1500000, breakMs: 300000, longBreakMs: 900000 } } }, 'my-origin')
    expect(useStore.getState().theme).toBe('midnight')
  })
})
