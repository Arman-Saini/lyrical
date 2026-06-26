import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initSync } from './store/sync'
import { applyTheme } from './themes/index'
import { useStore } from './store/index'
import './index.css'

applyTheme(useStore.getState().theme)

// Hub (/) is the Spotify source of truth — it must never have its track/lyrics/progress
// overwritten by stale re-broadcasts from view windows.
const isHub = window.location.pathname === '/' || window.location.pathname === '/callback'
initSync(isHub ? 'hub' : 'view')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
