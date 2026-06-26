import { useStore } from './index'
import type { AppState } from '../types'

interface SyncMessage {
  origin: string
  state: AppState
}

const WINDOW_ID = Math.random().toString(36).slice(2)

export function buildMessage(origin: string): SyncMessage {
  const s = useStore.getState()
  const state: AppState = {
    track: s.track, progressMs: s.progressMs, syncNudgeMs: s.syncNudgeMs,
    lyrics: s.lyrics, activeLyricIndex: s.activeLyricIndex, theme: s.theme,
    background: s.background, overlayOpacity: s.overlayOpacity, timerState: s.timerState,
  }
  return { origin, state }
}

export function applyMessage(msg: SyncMessage, ownOrigin = WINDOW_ID): void {
  if (msg.origin === ownOrigin) return
  const { setTrack, setProgressMs, setLyrics, setActiveLyricIndex,
    setTheme, setBackground, setOverlayOpacity, setTimerState } = useStore.getState()
  const s = msg.state
  setTrack(s.track)
  setProgressMs(s.progressMs)
  setLyrics(s.lyrics)
  setActiveLyricIndex(s.activeLyricIndex)
  setTheme(s.theme)
  setBackground(s.background)
  setOverlayOpacity(s.overlayOpacity)
  setTimerState(s.timerState)
  useStore.setState({ syncNudgeMs: s.syncNudgeMs })
}

export function initSync(): () => void {
  const channel = new BroadcastChannel('lyrical')

  channel.onmessage = (event: MessageEvent<SyncMessage>) => {
    applyMessage(event.data, WINDOW_ID)
  }

  const unsub = useStore.subscribe((state, prev) => {
    if (state === prev) return
    channel.postMessage(buildMessage(WINDOW_ID))
  })

  return () => {
    unsub()
    channel.close()
  }
}
