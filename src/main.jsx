import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import { FlowProvider } from './state/FlowContext.jsx'
import './styles/global.css'
import './styles/components.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <FlowProvider>
        <App />
      </FlowProvider>
    </HashRouter>
  </React.StrictMode>,
)
