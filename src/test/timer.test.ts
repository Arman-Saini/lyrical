import { describe, it, expect } from 'vitest'
import { nextPhase, phaseLabel } from '../components/PomodoroTimer/timerLogic'

describe('Timer phase logic', () => {
  it('work phase after 2 cycles goes to break', () => {
    const next = nextPhase('work', 2, 1500000, 300000, 900000)
    expect(next.phase).toBe('break')
  })

  it('work phase after 4th cycle (cycleCount=3) goes to longBreak', () => {
    const next = nextPhase('work', 3, 1500000, 300000, 900000)
    expect(next.phase).toBe('longBreak')
  })

  it('break goes back to work', () => {
    const next = nextPhase('break', 1, 1500000, 300000, 900000)
    expect(next.phase).toBe('work')
    expect(next.remainingMs).toBe(1500000)
  })

  it('longBreak goes back to work with reset cycleCount', () => {
    const next = nextPhase('longBreak', 4, 1500000, 300000, 900000)
    expect(next.phase).toBe('work')
    expect(next.cycleCount).toBe(0)
  })

  it('phaseLabel returns correct string', () => {
    expect(phaseLabel('work')).toBe('Focus')
    expect(phaseLabel('break')).toBe('Break')
    expect(phaseLabel('longBreak')).toBe('Long Break')
  })
})
