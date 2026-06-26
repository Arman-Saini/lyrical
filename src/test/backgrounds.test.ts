import { describe, it, expect, beforeEach } from 'vitest'
import { saveBackground, loadBackground, deleteBackground } from '../backgrounds/indexeddb'

describe('Background IndexedDB', () => {
  beforeEach(async () => { await deleteBackground() })

  it('loadBackground returns null when nothing stored', async () => {
    const result = await loadBackground()
    expect(result).toBeNull()
  })

  it('saveBackground then loadBackground returns the blob', async () => {
    const blob = new Blob(['fake-image-data'], { type: 'image/png' })
    await saveBackground(blob)
    const retrieved = await loadBackground()
    expect(retrieved).not.toBeNull()
    expect(retrieved!.type).toBe('image/png')
  })

  it('deleteBackground removes stored blob', async () => {
    const blob = new Blob(['data'], { type: 'image/gif' })
    await saveBackground(blob)
    await deleteBackground()
    expect(await loadBackground()).toBeNull()
  })
})
