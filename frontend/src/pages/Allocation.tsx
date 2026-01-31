import { useState } from 'react';
import {
  evaluateAllocation,
  AllocationResult,
  isDemoDataNotLoaded,
} from '../api/client';
import DemoDataBanner from '../components/DemoDataBanner';

function Allocation() {
  const [scarceSkill, setScarceSkill] = useState('llm');
  const [availablePeople, setAvailablePeople] = useState(3);

  const [result, setResult] = useState<AllocationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsDemoData, setNeedsDemoData] = useState(false);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setNeedsDemoData(false);

    try {
      const response = await evaluateAllocation({
        scarceSkill,
        availablePeople,
      });
      setResult(response);
    } catch (err) {
      if (isDemoDataNotLoaded(err)) {
        setNeedsDemoData(true);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to evaluate allocation');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLoaded = () => {
    setNeedsDemoData(false);
    handleSubmit();
  };

  const getRiskBadgeClass = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'badge badge-danger';
      case 'medium':
        return 'badge badge-warning';
      default:
        return 'badge badge-success';
    }
  };

  const suggestedSkills = ['llm', 'genai', 'machine learning', 'kubernetes', 'react'];

  return (
    <div className="scenario-page">
      <h2>📊 Scenario 4: Talent Allocation</h2>
      <p className="subtitle">
        Allocate scarce skills across competing programs based on priority and business impact.
      </p>

      {needsDemoData && (
        <DemoDataBanner onLoaded={handleDemoLoaded} />
      )}

      <div className="scenario-layout">
        <div className="form-section">
          <div className="card">
            <h3>Allocation Parameters</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="scarceSkill">Scarce Skill</label>
                <input
                  id="scarceSkill"
                  type="text"
                  value={scarceSkill}
                  onChange={(e) => setScarceSkill(e.target.value)}
                  placeholder="e.g., llm, genai, kubernetes"
                />
                <div className="skill-suggestions">
                  {suggestedSkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      className="suggestion-chip"
                      onClick={() => setScarceSkill(skill)}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="availablePeople">Available People</label>
                <input
                  id="availablePeople"
                  type="number"
                  min={0}
                  max={50}
                  value={availablePeople}
                  onChange={(e) => setAvailablePeople(parseInt(e.target.value) || 0)}
                />
                <p className="form-help">
                  Total specialists available for allocation
                </p>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Allocate Resources'}
              </button>
            </form>
          </div>
        </div>

        <div className="results-section">
          {error && (
            <div className="card error-card">
              <p className="error">{error}</p>
            </div>
          )}

          {result && (
            <>
              <div className="card">
                <h3>Allocation for "{result.scarceSkill}"</h3>
                <p className="allocation-summary">
                  <strong>{result.availablePeople}</strong> people available •{' '}
                  <strong>{result.programRankings.length}</strong> programs need this skill
                </p>
              </div>

              <div className="card">
                <h4>📋 Program Rankings</h4>
                {result.programRankings.length === 0 ? (
                  <p>No programs require this skill. Try a different skill.</p>
                ) : (
                  <div className="allocation-table-container">
                    <table className="allocation-table">
                      <thead>
                        <tr>
                          <th>Program</th>
                          <th>Department</th>
                          <th>Priority</th>
                          <th>Allocated</th>
                          <th>Risk</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.programRankings.map((prog, i) => (
                          <tr key={prog.programId}>
                            <td>
                              <span className="rank-number">#{i + 1}</span>
                              <span className="program-name">{prog.name}</span>
                            </td>
                            <td>{prog.department}</td>
                            <td>
                              <span className="priority-score">{prog.priorityScore}</span>
                            </td>
                            <td>
                              <span className={`allocation-count ${prog.suggestedAllocation > 0 ? 'has-allocation' : ''}`}>
                                {prog.suggestedAllocation}
                              </span>
                            </td>
                            <td>
                              <span className={getRiskBadgeClass(prog.riskIfUnfilled)}>
                                {prog.riskIfUnfilled}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {result.programRankings.length > 0 && (
                <div className="card">
                  <h4>📝 Priority Reasons</h4>
                  <ul className="reasons-list">
                    {result.programRankings.slice(0, 3).map((prog) => (
                      <li key={prog.programId}>
                        <strong>{prog.name}:</strong> {prog.reasonSummary}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="card">
                <h4>🎯 Organizational Actions</h4>
                <ul className="org-actions-list">
                  {result.orgActions.map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {!result && !error && (
            <div className="card placeholder-card">
              <h3>🎯 Run Allocation</h3>
              <p>Enter a scarce skill and available headcount to see prioritized allocation across programs.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card info-card">
        <h3>Allocation Priority Scoring</h3>
        <table className="rules-table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Values</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Business Impact</td>
              <td>Low / Medium / High</td>
              <td>20 / 50 / 80</td>
            </tr>
            <tr>
              <td>Urgency</td>
              <td>Low / Medium / High</td>
              <td>10 / 30 / 50</td>
            </tr>
            <tr>
              <td>Deadline</td>
              <td>≤4 weeks / ≤8 weeks</td>
              <td>+20 / +10</td>
            </tr>
            <tr>
              <td>Scarcity Pressure</td>
              <td>Need &gt; Available</td>
              <td>+10</td>
            </tr>
            <tr>
              <td>Skill Match</td>
              <td>Program requires skill</td>
              <td>+15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Allocation;
