import { describe, it, expect } from 'vitest'
import { generateCodeVerifier, generateCodeChallenge } from '../spotify/auth'

describe('Spotify PKCE', () => {
  it('generateCodeVerifier returns string of 43-128 chars', () => {
    const v = generateCodeVerifier()
    expect(v.length).toBeGreaterThanOrEqual(43)
    expect(v.length).toBeLessThanOrEqual(128)
  })

  it('generateCodeVerifier uses only base64url characters', () => {
    const v = generateCodeVerifier()
    expect(v).toMatch(/^[A-Za-z0-9\-._~]+$/)
  })

  it('generateCodeChallenge returns a non-empty string', async () => {
    const v = generateCodeVerifier()
    const c = await generateCodeChallenge(v)
    expect(c.length).toBeGreaterThan(0)
    expect(c).not.toContain('+')
    expect(c).not.toContain('/')
    expect(c).not.toContain('=')
  })

  it('same verifier always produces same challenge', async () => {
    const v = generateCodeVerifier()
    const c1 = await generateCodeChallenge(v)
    const c2 = await generateCodeChallenge(v)
    expect(c1).toBe(c2)
  })
})
