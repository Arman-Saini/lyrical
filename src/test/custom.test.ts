import { describe, it, expect, beforeEach } from 'vitest'
import { saveCustomLyrics, loadCustomLyrics, deleteCustomLyrics, customLyricsKey } from '../lyrics/custom'

describe('Custom lyrics localStorage', () => {
  beforeEach(() => localStorage.clear())

  it('customLyricsKey produces consistent key', () => {
    expect(customLyricsKey('The Weeknd', 'Blinding Lights'))
      .toBe('custom_lyrics::the weeknd::blinding lights')
  })

  it('saveCustomLyrics stores and loadCustomLyrics retrieves', () => {
    saveCustomLyrics('Artist', 'Track', '[00:01.00] Hello')
    expect(loadCustomLyrics('Artist', 'Track')).toBe('[00:01.00] Hello')
  })

  it('loadCustomLyrics returns null when not stored', () => {
    expect(loadCustomLyrics('Nobody', 'Nothing')).toBeNull()
  })

  it('deleteCustomLyrics removes the entry', () => {
    saveCustomLyrics('Artist', 'Track', '[00:01.00] Hello')
    deleteCustomLyrics('Artist', 'Track')
    expect(loadCustomLyrics('Artist', 'Track')).toBeNull()
  })

  it('lookup is case-insensitive', () => {
    saveCustomLyrics('THE WEEKND', 'BLINDING LIGHTS', '[00:01.00] Line')
    expect(loadCustomLyrics('The Weeknd', 'Blinding Lights')).toBe('[00:01.00] Line')
  })
})
