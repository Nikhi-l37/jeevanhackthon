import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Match from './pages/Match';
import Retention from './pages/Retention';
import CapabilityGap from './pages/CapabilityGap';
import ExpectationBalance from './pages/ExpectationBalance';
import EarlyRisk from './pages/EarlyRisk';
import Allocation from './pages/Allocation';
import { loadDemo } from './api/client';

function App() {
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoLoaded, setDemoLoaded] = useState(false);

  const handleLoadDemo = async () => {
    setDemoLoading(true);
    try {
      await loadDemo();
      setDemoLoaded(true);
      setTimeout(() => setDemoLoaded(false), 2000);
    } catch (err) {
      console.error('Failed to load demo:', err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="app">
        <header className="header">
          <h1>🎯 Talent Acquisition & Retention</h1>
          <nav>
            <NavLink to="/" end>Dashboard</NavLink>
            <NavLink to="/match">Match</NavLink>
            <NavLink to="/retention">Retention</NavLink>
            <NavLink to="/capability-gap">Scenario 1</NavLink>
            <NavLink to="/expectation-balance">Scenario 2</NavLink>
            <NavLink to="/early-risk">Scenario 3</NavLink>
            <NavLink to="/allocation">Scenario 4</NavLink>
            <button 
              onClick={handleLoadDemo} 
              disabled={demoLoading}
              className="btn-nav-demo"
            >
              {demoLoading ? '⏳ Loading...' : demoLoaded ? '✅ Loaded' : '📦 Load Demo'}
            </button>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/match" element={<Match />} />
            <Route path="/retention" element={<Retention />} />
            <Route path="/capability-gap" element={<CapabilityGap />} />
            <Route path="/expectation-balance" element={<ExpectationBalance />} />
            <Route path="/early-risk" element={<EarlyRisk />} />
            <Route path="/allocation" element={<Allocation />} />
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
