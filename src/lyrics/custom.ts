const PREFIX = 'custom_lyrics::'

export function customLyricsKey(artist: string, track: string): string {
  return `${PREFIX}${artist.toLowerCase()}::${track.toLowerCase()}`
}

export function saveCustomLyrics(artist: string, track: string, lrc: string): void {
  localStorage.setItem(customLyricsKey(artist, track), lrc)
}

export function loadCustomLyrics(artist: string, track: string): string | null {
  return localStorage.getItem(customLyricsKey(artist, track))
}

export function deleteCustomLyrics(artist: string, track: string): void {
  localStorage.removeItem(customLyricsKey(artist, track))
}
