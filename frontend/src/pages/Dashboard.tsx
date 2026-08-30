import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { loadDemo, getDemoStatus, DemoStatus } from '../api/client';

function Dashboard() {
  const [status, setStatus] = useState<DemoStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const result = await getDemoStatus();
      setStatus(result);
    } catch {
      // Server might not be running yet
      setStatus({ loaded: false, counts: null });
    }
  };

  const handleLoadDemo = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await loadDemo();
      setStatus({
        loaded: true,
        counts: result.counts,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <h2>🎯 Digital Talent Acquisition & Retention Platform</h2>
      <p className="subtitle">
        Intelligent candidate matching, retention risk analysis, strategic capability gap decisions, and talent allocation.
      </p>
      
      <div className="card">
        <h3>🚀 System & Database Status</h3>
        
        {!status?.loaded ? (
          <div className="load-section">
            <p>Database is empty or uninitialized. Load the demo dataset to get started.</p>
            <button 
              onClick={handleLoadDemo} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? '⏳ Loading Dataset...' : '📦 Load Demo Dataset'}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <div className="status-section">
            <div className="status-header">
              <p className="success">✅ Supabase PostgreSQL Database Connected & Populated</p>
              <button 
                onClick={handleLoadDemo} 
                disabled={loading}
                className="btn btn-secondary btn-sm"
              >
                {loading ? 'Refreshing...' : '🔄 Reload Demo Data'}
              </button>
            </div>
            <div className="counts">
              <div className="count-item">
                <span className="count-number">{status.counts?.employees ?? 0}</span>
                <span className="count-label">Employees</span>
              </div>
              <div className="count-item">
                <span className="count-number">{status.counts?.candidates ?? 0}</span>
                <span className="count-label">Candidates</span>
              </div>
              <div className="count-item">
                <span className="count-number">{status.counts?.jobs ?? 0}</span>
                <span className="count-label">Open Jobs</span>
              </div>
              <div className="count-item">
                <span className="count-number">{status.counts?.programs ?? 6}</span>
                <span className="count-label">Strategic Programs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="features">
        <div className="card feature-card">
          <h3>🔍 Candidate Matching</h3>
          <p>Search candidates by skill requirements with transparent overlap scoring.</p>
          <ul>
            <li>Multi-skill query matching</li>
            <li>Match score calculation (0-100%)</li>
            <li>Matched skills highlighting</li>
          </ul>
          <Link to="/match" className="btn btn-secondary">
            Try Matching →
          </Link>
        </div>

        <div className="card feature-card">
          <h3>📊 Retention Risk Analysis</h3>
          <p>Analyze employee retention flight risk with actionable HR recommendations.</p>
          <ul>
            <li>Rule-based risk scoring & tiers</li>
            <li>Stagnation, tenure & comp drivers</li>
            <li>Targeted retention actions</li>
          </ul>
          <Link to="/retention" className="btn btn-secondary">
            View Analysis →
          </Link>
        </div>

        <div className="card feature-card">
          <h3>🎯 Scenario 1: Capability Gap</h3>
          <p>Decide whether to hire externally, upskill internally, redesign roles, or contract.</p>
          <ul>
            <li>Multi-factor strategy scoring</li>
            <li>Timeline & budget trade-offs</li>
            <li>Concrete next-step roadmap</li>
          </ul>
          <Link to="/capability-gap" className="btn btn-secondary">
            Analyze Gap →
          </Link>
        </div>

        <div className="card feature-card">
          <h3>⚖️ Scenario 2: Expectation Balance</h3>
          <p>Balance candidate salary & progression expectations with org sustainability.</p>
          <ul>
            <li>Tiered offer guidance (Comp/Equity)</li>
            <li>Flight risk early flags</li>
            <li>Long-term retention levers</li>
          </ul>
          <Link to="/expectation-balance" className="btn btn-secondary">
            Evaluate Balance →
          </Link>
        </div>

        <div className="card feature-card">
          <h3>🚨 Scenario 3: Early Risk Detection</h3>
          <p>Detect early disengagement and burnout signals before employees resign.</p>
          <ul>
            <li>Overtime & workload monitoring</li>
            <li>1:1 check-ins & PTO indicators</li>
            <li>Manager intervention guidance</li>
          </ul>
          <Link to="/early-risk" className="btn btn-secondary">
            View Early Signals →
          </Link>
        </div>

        <div className="card feature-card">
          <h3>🔀 Scenario 4: Talent Allocation</h3>
          <p>Optimize and prioritize scarce critical skillsets across competing programs.</p>
          <ul>
            <li>Business impact & urgency ranking</li>
            <li>Headcount deficit suggestions</li>
            <li>Org risk mitigation steps</li>
          </ul>
          <Link to="/allocation" className="btn btn-secondary">
            Allocate Skills →
          </Link>
        </div>
      </div>

      <div className="card info-card">
        <h3>ℹ️ Architecture & Capabilities</h3>
        <p>
          This system is built with <strong>React (Vite + TypeScript)</strong>, <strong>Node.js (Express + TypeScript)</strong>, and <strong>Supabase (PostgreSQL with Prisma ORM)</strong> for production-grade persistence and fast scenario modeling.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
