import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import Proposals from './pages/Proposals'
import ProposalDetail from './pages/ProposalDetail'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <Link to="/" className="app-logo">Proxy Voting</Link>
        {/* @ts-ignore */}
        <appkit-button />
      </header>
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proposals/:tokenAddress" element={<Proposals />} />
          <Route path="/proposal/:id" element={<ProposalDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
