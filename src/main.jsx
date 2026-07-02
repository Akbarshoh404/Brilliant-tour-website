import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './i18n'
import './styles/global.scss'
import App from './app/App.jsx'
import PageLoader from './app/PageLoader.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense fallback={<PageLoader />}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </StrictMode>,
)
