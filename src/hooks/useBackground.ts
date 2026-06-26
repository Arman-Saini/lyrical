import { useEffect, useState } from 'react'
import { useStore } from '../store/index'
import { loadBackground } from '../backgrounds/indexeddb'

export function useBackground() {
  const { background, overlayOpacity } = useStore()
  const [bgUrl, setBgUrl] = useState<string | null>(null)

  useEffect(() => {
    if (background === 'custom') {
      loadBackground().then(blob => {
        if (blob) setBgUrl(URL.createObjectURL(blob))
      })
    } else {
      setBgUrl(null)
    }
  }, [background])

  return { bgUrl, overlayOpacity }
}
