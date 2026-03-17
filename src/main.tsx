import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 添加调试日志
console.log('[Main] Starting app initialization...')

const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('[Main] Root element not found!')
} else {
  console.log('[Main] Root element found, rendering app...')
  
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
    )
    console.log('[Main] App rendered successfully')
  } catch (error) {
    console.error('[Main] Error rendering app:', error)
  }
}