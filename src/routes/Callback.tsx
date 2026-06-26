import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { handleCallback } from '../spotify/auth'

export default function Callback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const err = params.get('error')

    if (err || !code) {
      setError(err ?? 'No code returned')
      return
    }

    handleCallback(code)
      .then(() => navigate('/'))
      .catch(e => setError(String(e)))
  }, [navigate])

  if (error) return <div style={{ color: 'red', padding: 32 }}>Auth error: {error}</div>
  return <div style={{ color: 'white', padding: 32 }}>Connecting to Spotify...</div>
}
