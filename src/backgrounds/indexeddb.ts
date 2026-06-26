const DB_NAME = 'lyrical_bg'
const STORE = 'backgrounds'
const KEY = 'custom'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

export async function saveBackground(blob: Blob): Promise<void> {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const tx = db.transaction(STORE, 'readwrite')
      const wrapper = {
        data: reader.result,
        type: blob.type
      }
      const req = tx.objectStore(STORE).put(wrapper, KEY)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsArrayBuffer(blob)
  })
}

export async function loadBackground(): Promise<Blob | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(KEY)
    req.onsuccess = () => {
      const result = req.result
      if (!result) {
        resolve(null)
        return
      }
      // Handle both new format (wrapper with data/type) and raw Blob
      if (result.data && result.type !== undefined) {
        // New format: reconstruct Blob from ArrayBuffer and type
        const blob = new Blob([result.data], { type: result.type })
        resolve(blob)
      } else if (result instanceof Blob) {
        // Old format or direct Blob
        resolve(result)
      } else {
        resolve(null)
      }
    }
    req.onerror = () => reject(req.error)
  })
}

export async function deleteBackground(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const req = tx.objectStore(STORE).delete(KEY)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}
