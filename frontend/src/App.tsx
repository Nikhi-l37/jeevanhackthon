import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Match from './pages/Match';
import Retention from './pages/Retention';
import CapabilityGap from './pages/CapabilityGap';
import ExpectationBalance from './pages/ExpectationBalance';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <h1>🎯 Talent Acquisition & Retention</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/match">Match</Link>
            <Link to="/retention">Retention</Link>
            <Link to="/capability-gap">Capability Gap</Link>
            <Link to="/expectation-balance">Expectation Balance</Link>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/match" element={<Match />} />
            <Route path="/retention" element={<Retention />} />
            <Route path="/capability-gap" element={<CapabilityGap />} />
            <Route path="/expectation-balance" element={<ExpectationBalance />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>Hackathon Prototype 2026 | Digital Talent Experience</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
