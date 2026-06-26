import type { TimerPhase, TimerState } from '../../types'

export function phaseLabel(phase: TimerPhase): string {
  return phase === 'work' ? 'Focus' : phase === 'break' ? 'Break' : 'Long Break'
}

export function nextPhase(
  phase: TimerPhase,
  cycleCount: number,
  workMs: number,
  breakMs: number,
  longBreakMs: number
): Pick<TimerState, 'phase' | 'remainingMs' | 'cycleCount'> {
  if (phase === 'work') {
    const newCount = cycleCount + 1
    if (cycleCount > 0 && cycleCount % 4 === 0) {
      return { phase: 'longBreak', remainingMs: longBreakMs, cycleCount: newCount }
    }
    return { phase: 'break', remainingMs: breakMs, cycleCount: newCount }
  }
  return { phase: 'work', remainingMs: workMs, cycleCount: phase === 'longBreak' ? 0 : cycleCount }
}
