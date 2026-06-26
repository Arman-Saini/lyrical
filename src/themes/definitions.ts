import type { Theme } from '../types'

export const themes: Theme[] = [
  // ── DARK ──────────────────────────────────────────────────────────
  {
    id: 'midnight', label: 'Midnight', category: 'dark',
    vars: { '--bg': '#0a0a0f', '--surface': '#12121a', '--surface-2': '#1a1a28',
      '--accent': '#7c3aed', '--accent-2': '#a78bfa', '--text': '#f1f0ff',
      '--text-muted': '#8b8ba7', '--border': '#2a2a3f',
      '--font-display': 'Georgia, serif', '--font-body': 'system-ui, sans-serif', '--radius': '12px' }
  },
  {
    id: 'amoled', label: 'AMOLED', category: 'dark',
    vars: { '--bg': '#000000', '--surface': '#0d0d0d', '--surface-2': '#1a1a1a',
      '--accent': '#00d4ff', '--text': '#ffffff', '--text-muted': '#888888',
      '--border': '#222222', '--font-display': 'system-ui, sans-serif',
      '--font-body': 'system-ui, sans-serif', '--radius': '8px' }
  },
  {
    id: 'dracula', label: 'Dracula', category: 'dark',
    vars: { '--bg': '#282a36', '--surface': '#44475a', '--surface-2': '#3a3d4f',
      '--accent': '#bd93f9', '--accent-2': '#ff79c6', '--text': '#f8f8f2',
      '--text-muted': '#6272a4', '--border': '#6272a4',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '8px' }
  },
  {
    id: 'tokyo-night', label: 'Tokyo Night', category: 'dark',
    vars: { '--bg': '#1a1b26', '--surface': '#24283b', '--surface-2': '#2a2f45',
      '--accent': '#7aa2f7', '--accent-2': '#bb9af7', '--text': '#c0caf5',
      '--text-muted': '#565f89', '--border': '#3b4261',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '10px' }
  },
  {
    id: 'moody-purple', label: 'Moody Purple', category: 'dark',
    vars: { '--bg': '#120e1e', '--surface': '#1e1730', '--surface-2': '#2a2040',
      '--accent': '#c084fc', '--accent-2': '#e879f9', '--text': '#e2d9f3',
      '--text-muted': '#9b8ec4', '--border': '#3d2d5e',
      '--font-display': 'Georgia, serif', '--font-body': 'system-ui, sans-serif', '--radius': '12px' }
  },
  {
    id: 'cyberpunk', label: 'Cyberpunk', category: 'dark',
    vars: { '--bg': '#0d0d0d', '--surface': '#1a1a1a', '--surface-2': '#252525',
      '--accent': '#f7df1e', '--accent-2': '#00ffff', '--text': '#ffffff',
      '--text-muted': '#999999', '--border': '#f7df1e40',
      '--font-display': "'Courier New', monospace", '--font-body': "'Courier New', monospace", '--radius': '0px' }
  },
  {
    id: 'ocean-deep', label: 'Ocean Deep', category: 'dark',
    vars: { '--bg': '#0a1628', '--surface': '#0f2040', '--surface-2': '#162d5a',
      '--accent': '#38bdf8', '--accent-2': '#818cf8', '--text': '#bae6fd',
      '--text-muted': '#60a5fa', '--border': '#1e3a6e',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '14px' }
  },
  {
    id: 'forest-night', label: 'Forest Night', category: 'dark',
    vars: { '--bg': '#0a1f0a', '--surface': '#0f2d0f', '--surface-2': '#163d16',
      '--accent': '#4ade80', '--accent-2': '#86efac', '--text': '#bbf7d0',
      '--text-muted': '#6ab77a', '--border': '#1d4d1d',
      '--font-display': 'Georgia, serif', '--font-body': 'system-ui, sans-serif', '--radius': '12px' }
  },
  {
    id: 'crimson', label: 'Crimson', category: 'dark',
    vars: { '--bg': '#1a0a0a', '--surface': '#2d0f0f', '--surface-2': '#3d1515',
      '--accent': '#ef4444', '--accent-2': '#f87171', '--text': '#fecaca',
      '--text-muted': '#f87171', '--border': '#5c1e1e',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '8px' }
  },
  {
    id: 'slate', label: 'Slate', category: 'dark',
    vars: { '--bg': '#0f172a', '--surface': '#1e293b', '--surface-2': '#2d3f55',
      '--accent': '#94a3b8', '--accent-2': '#60a5fa', '--text': '#e2e8f0',
      '--text-muted': '#64748b', '--border': '#334155',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '10px' }
  },
  {
    id: 'nord', label: 'Nord', category: 'dark',
    vars: { '--bg': '#2e3440', '--surface': '#3b4252', '--surface-2': '#434c5e',
      '--accent': '#88c0d0', '--accent-2': '#81a1c1', '--text': '#eceff4',
      '--text-muted': '#d8dee9', '--border': '#4c566a',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '8px' }
  },
  {
    id: 'gruvbox', label: 'Gruvbox', category: 'dark',
    vars: { '--bg': '#1d2021', '--surface': '#282828', '--surface-2': '#32302f',
      '--accent': '#d79921', '--accent-2': '#b8bb26', '--text': '#ebdbb2',
      '--text-muted': '#a89984', '--border': '#504945',
      '--font-display': "'Courier New', monospace", '--font-body': "'Courier New', monospace", '--radius': '4px' }
  },
  // ── LIGHT ─────────────────────────────────────────────────────────
  {
    id: 'paper', label: 'Paper', category: 'light',
    vars: { '--bg': '#faf8f5', '--surface': '#ffffff', '--surface-2': '#f5f3f0',
      '--accent': '#6366f1', '--accent-2': '#8b5cf6', '--text': '#1c1917',
      '--text-muted': '#78716c', '--border': '#e7e5e4',
      '--font-display': 'Georgia, serif', '--font-body': 'system-ui, sans-serif', '--radius': '12px' }
  },
  {
    id: 'arctic', label: 'Arctic', category: 'light',
    vars: { '--bg': '#f0f4f8', '--surface': '#ffffff', '--surface-2': '#e2e8f0',
      '--accent': '#3b82f6', '--accent-2': '#6366f1', '--text': '#1e293b',
      '--text-muted': '#64748b', '--border': '#cbd5e1',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '10px' }
  },
  {
    id: 'latte', label: 'Latte', category: 'light',
    vars: { '--bg': '#eff1f5', '--surface': '#ffffff', '--surface-2': '#e6e9ef',
      '--accent': '#8839ef', '--accent-2': '#dd7878', '--text': '#4c4f69',
      '--text-muted': '#8c8fa1', '--border': '#ccd0da',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '10px' }
  },
  {
    id: 'soft-warm', label: 'Soft Warm', category: 'light',
    vars: { '--bg': '#fdf6ec', '--surface': '#fff9f0', '--surface-2': '#faebd7',
      '--accent': '#f59e0b', '--accent-2': '#ef4444', '--text': '#44403c',
      '--text-muted': '#78716c', '--border': '#e7d5bc',
      '--font-display': 'Georgia, serif', '--font-body': 'system-ui, sans-serif', '--radius': '14px' }
  },
  {
    id: 'rose-quartz', label: 'Rose Quartz', category: 'light',
    vars: { '--bg': '#fff0f3', '--surface': '#ffffff', '--surface-2': '#ffe4e8',
      '--accent': '#fb7185', '--accent-2': '#e879f9', '--text': '#4a1942',
      '--text-muted': '#9d4e6e', '--border': '#fecdd3',
      '--font-display': 'Georgia, serif', '--font-body': 'system-ui, sans-serif', '--radius': '16px' }
  },
  // ── SPECIAL ───────────────────────────────────────────────────────
  {
    id: 'vaporwave', label: 'Vaporwave', category: 'special',
    vars: { '--bg': '#1a0533', '--surface': '#2d1050', '--surface-2': '#3d1a6e',
      '--accent': '#ff71ce', '--accent-2': '#b967ff', '--text': '#fffb96',
      '--text-muted': '#ff9de2', '--border': '#4a1a8a',
      '--font-display': "'Courier New', monospace", '--font-body': 'system-ui, sans-serif', '--radius': '8px' }
  },
  {
    id: 'retro-crt', label: 'Retro CRT', category: 'special',
    scanlines: true,
    vars: { '--bg': '#001400', '--surface': '#001900', '--surface-2': '#002200',
      '--accent': '#00ff41', '--text': '#00ff41', '--text-muted': '#00c836',
      '--border': '#004400', '--font-display': "'Courier New', monospace",
      '--font-body': "'Courier New', monospace", '--radius': '0px' }
  },
  {
    id: 'glassmorphism', label: 'Glass', category: 'special',
    vars: { '--bg': '#0f0f23', '--surface': 'rgba(255,255,255,0.08)', '--surface-2': 'rgba(255,255,255,0.04)',
      '--accent': '#7c3aed', '--accent-2': '#06b6d4', '--text': '#ffffff',
      '--text-muted': 'rgba(255,255,255,0.6)', '--border': 'rgba(255,255,255,0.15)',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif',
      '--radius': '20px', '--blur': '20px' }
  },
  {
    id: 'sunset-gradient', label: 'Sunset', category: 'special',
    vars: { '--bg': '#1a0a2e', '--surface': '#2a1545', '--surface-2': '#3a1d5e',
      '--accent': '#ff6b35', '--accent-2': '#ffd700', '--text': '#fff8f0',
      '--text-muted': '#ffb347', '--border': '#5a2d8a',
      '--font-display': 'system-ui, sans-serif', '--font-body': 'system-ui, sans-serif', '--radius': '12px' }
  },
  {
    id: 'matrix', label: 'Matrix', category: 'special',
    scanlines: true,
    vars: { '--bg': '#000d00', '--surface': '#001a00', '--surface-2': '#002600',
      '--accent': '#00ff41', '--text': '#00ff41', '--text-muted': '#008f11',
      '--border': '#003300', '--font-display': "'Courier New', monospace",
      '--font-body': "'Courier New', monospace", '--radius': '0px' }
  },
]
