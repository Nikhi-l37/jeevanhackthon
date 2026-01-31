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
      <h2>Welcome to Digital Talent Experience</h2>
      
      <div className="card">
        <h3>🚀 Quick Start</h3>
        
        {!status?.loaded ? (
          <div className="load-section">
            <p>Load demo data to get started with the prototype.</p>
            <button 
              onClick={handleLoadDemo} 
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Loading...' : 'Load Demo Data'}
            </button>
            {error && <p className="error">{error}</p>}
          </div>
        ) : (
          <div className="status-section">
            <p className="success">✅ Demo data loaded successfully!</p>
            <div className="counts">
              <div className="count-item">
                <span className="count-number">{status.counts?.employees}</span>
                <span className="count-label">Employees</span>
              </div>
              <div className="count-item">
                <span className="count-number">{status.counts?.candidates}</span>
                <span className="count-label">Candidates</span>
              </div>
              <div className="count-item">
                <span className="count-number">{status.counts?.jobs}</span>
                <span className="count-label">Jobs</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="features">
        <div className="card feature-card">
          <h3>🔍 Candidate Matching</h3>
          <p>Search candidates by skills with transparent scoring.</p>
          <ul>
            <li>Enter skills to search</li>
            <li>View match scores (0-100)</li>
            <li>See which skills matched</li>
          </ul>
          <Link to="/match" className="btn btn-secondary">
            Try Matching →
          </Link>
        </div>

        <div className="card feature-card">
          <h3>📊 Retention Analysis</h3>
          <p>Analyze employee retention risk with actionable insights.</p>
          <ul>
            <li>Rule-based risk scoring</li>
            <li>Clear risk reasons</li>
            <li>Recommended actions</li>
          </ul>
          <Link to="/retention" className="btn btn-secondary">
            View Analysis →
          </Link>
        </div>
      </div>

      <div className="card info-card">
        <h3>ℹ️ About This Prototype</h3>
        <p>
          This hackathon prototype demonstrates simple, explainable approaches to:
        </p>
        <ul>
          <li><strong>Talent Acquisition:</strong> Skill-overlap ranking for candidate matching</li>
          <li><strong>Retention:</strong> Rule-based risk scoring with transparent reasons</li>
        </ul>
        <p className="note">
          Note: Uses in-memory storage. Data resets when server restarts.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;
