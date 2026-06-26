const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const REDIRECT_URI = (import.meta.env.VITE_REDIRECT_URI as string | undefined)
  ?? 'http://127.0.0.1:5173/callback'
const SCOPES = 'user-read-currently-playing user-read-playback-state'
const TOKEN_KEY = 'lyrical_tokens'

interface Tokens {
  access_token: string
  refresh_token: string
  expires_at: number
}

export function generateCodeVerifier(): string {
  const array = new Uint8Array(64)
  crypto.getRandomValues(array)
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    .slice(0, 128)
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const data = new TextEncoder().encode(verifier)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function initiateAuth(): Promise<void> {
  const verifier = generateCodeVerifier()
  const challenge = await generateCodeChallenge(verifier)
  sessionStorage.setItem('pkce_verifier', verifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: challenge,
  })
  window.location.href = `https://accounts.spotify.com/authorize?${params}`
}

export async function handleCallback(code: string): Promise<void> {
  const verifier = sessionStorage.getItem('pkce_verifier')
  if (!verifier) throw new Error('No PKCE verifier found')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: verifier,
    }),
  })
  if (!response.ok) throw new Error('Token exchange failed')

  const data = await response.json()
  const tokens: Tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens))
  sessionStorage.removeItem('pkce_verifier')
}

export function getTokens(): Tokens | null {
  const raw = localStorage.getItem(TOKEN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function getAccessToken(): string | null {
  const tokens = getTokens()
  if (!tokens) return null
  if (Date.now() >= tokens.expires_at - 30_000) return null
  return tokens.access_token
}

export function isAuthenticated(): boolean {
  return getTokens() !== null
}

export async function refreshAccessToken(): Promise<string> {
  const tokens = getTokens()
  if (!tokens) throw new Error('No tokens stored')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
      client_id: CLIENT_ID,
    }),
  })
  if (!response.ok) throw new Error('Token refresh failed')

  const data = await response.json()
  const updated: Tokens = {
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? tokens.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }
  localStorage.setItem(TOKEN_KEY, JSON.stringify(updated))
  return updated.access_token
}

export async function getValidToken(): Promise<string | null> {
  const token = getAccessToken()
  if (token) return token
  if (!isAuthenticated()) return null
  try { return await refreshAccessToken() } catch { return null }
}

export function logout(): void {
  localStorage.removeItem(TOKEN_KEY)
}
