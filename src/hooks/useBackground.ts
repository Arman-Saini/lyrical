import { useEffect, useState } from 'react'
import { useStore } from '../store/index'
import { loadBackground } from '../backgrounds/indexeddb'

export function useBackground() {
  const { background, overlayOpacity } = useStore()
  const [bgUrl, setBgUrl] = useState<string | null>(null)

  useEffect(() => {
    let url: string | null = null
    if (background === 'custom') {
      loadBackground().then(blob => {
        if (blob) {
          url = URL.createObjectURL(blob)
          setBgUrl(url)
        }
      })
    } else {
      setBgUrl(null)
    }
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [background])

  return { bgUrl, overlayOpacity }
}
