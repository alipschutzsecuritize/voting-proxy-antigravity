import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Web3ModalProvider } from './context/Web3Modal'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ModalProvider>
        <App />
      </Web3ModalProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
