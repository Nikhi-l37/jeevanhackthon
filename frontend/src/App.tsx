import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Match from './pages/Match';
import Retention from './pages/Retention';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <h1>🎯 Talent Acquisition & Retention</h1>
          <nav>
            <Link to="/">Dashboard</Link>
            <Link to="/match">Match Candidates</Link>
            <Link to="/retention">Retention Analysis</Link>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/match" element={<Match />} />
            <Route path="/retention" element={<Retention />} />
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
