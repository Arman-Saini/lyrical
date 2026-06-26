import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initSync } from './store/sync'
import { applyTheme } from './themes/index'
import { useStore } from './store/index'
import './index.css'

applyTheme(useStore.getState().theme)
initSync()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
