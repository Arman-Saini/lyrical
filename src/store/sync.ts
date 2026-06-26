import { useStore } from './index'
import type { AppState } from '../types'

interface SyncMessage {
  origin: string
  state: AppState
  progressAt: number
}

const WINDOW_ID = Math.random().toString(36).slice(2)

// Suppresses re-broadcast while applying an incoming message — prevents view↔view oscillation.
// Zustand fires subscribers synchronously inside setState, so setting this flag before
// setState and clearing it after is safe and always seen by the subscriber.
let applyingExternal = false

export function buildMessage(origin: string): SyncMessage {
  const s = useStore.getState()
  const state: AppState = {
    track: s.track, progressMs: s.progressMs, isPlaying: s.isPlaying,
    lyricsLoading: s.lyricsLoading,
    syncNudgeMs: s.syncNudgeMs, lyrics: s.lyrics, activeLyricIndex: s.activeLyricIndex,
    theme: s.theme, background: s.background, overlayOpacity: s.overlayOpacity,
    timerState: s.timerState,
  }
  return { origin, state, progressAt: s.lastProgressAt }
}

// Applied by VIEW windows when receiving a Hub broadcast.
export function applyMessage(msg: SyncMessage, ownOrigin = WINDOW_ID): void {
  if (msg.origin === ownOrigin) return

  const current = useStore.getState()
  const s = msg.state

  const updates: Partial<ReturnType<typeof useStore.getState>> = {}

  if (s.track?.id !== current.track?.id) updates.track = s.track
  if (msg.progressAt > current.lastProgressAt) {
    updates.progressMs = s.progressMs
    updates.lastProgressAt = msg.progressAt
    if (s.isPlaying !== current.isPlaying) updates.isPlaying = s.isPlaying
  }
  if (JSON.stringify(s.lyrics) !== JSON.stringify(current.lyrics)) {
    updates.lyrics = s.lyrics
    updates.activeLyricIndex = -1
  }
  if (s.lyricsLoading !== current.lyricsLoading) updates.lyricsLoading = s.lyricsLoading
  if (s.background !== current.background) updates.background = s.background
  if (s.overlayOpacity !== current.overlayOpacity) updates.overlayOpacity = s.overlayOpacity
  if (JSON.stringify(s.timerState) !== JSON.stringify(current.timerState)) updates.timerState = s.timerState
  if (s.syncNudgeMs !== current.syncNudgeMs) updates.syncNudgeMs = s.syncNudgeMs
  if (s.theme !== current.theme) {
    localStorage.setItem('lyrical_theme', s.theme)
    updates.theme = s.theme
  }

  if (Object.keys(updates).length === 0) return

  applyingExternal = true
  useStore.setState(updates)
  applyingExternal = false
}

// Applied by HUB when receiving a broadcast from a view window.
// Hub NEVER overwrites track/lyrics/progress — Hub is the Spotify source of truth.
function applyMessageAsHub(msg: SyncMessage): void {
  if (msg.origin === WINDOW_ID) return

  const current = useStore.getState()
  const s = msg.state

  const updates: Partial<ReturnType<typeof useStore.getState>> = {}

  if (s.background !== current.background) updates.background = s.background
  if (s.overlayOpacity !== current.overlayOpacity) updates.overlayOpacity = s.overlayOpacity
  if (JSON.stringify(s.timerState) !== JSON.stringify(current.timerState)) updates.timerState = s.timerState
  if (s.syncNudgeMs !== current.syncNudgeMs) updates.syncNudgeMs = s.syncNudgeMs
  if (s.theme !== current.theme) {
    localStorage.setItem('lyrical_theme', s.theme)
    updates.theme = s.theme
  }

  if (Object.keys(updates).length === 0) return

  applyingExternal = true
  useStore.setState(updates)
  applyingExternal = false
}

export function initSync(role: 'hub' | 'view' = 'view'): () => void {
  const channel = new BroadcastChannel('lyrical')

  channel.onmessage = (event: MessageEvent<SyncMessage>) => {
    if (role === 'hub') {
      applyMessageAsHub(event.data)
    } else {
      applyMessage(event.data, WINDOW_ID)
    }
  }

  let lastSent = ''
  const unsub = useStore.subscribe(() => {
    if (applyingExternal) return
    const snapshot = buildMessage(WINDOW_ID)
    const json = JSON.stringify(snapshot.state)
    if (json === lastSent) return
    lastSent = json
    channel.postMessage(snapshot)
  })

  return () => {
    unsub()
    channel.close()
  }
}
