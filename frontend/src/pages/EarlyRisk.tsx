import { useState, useEffect } from 'react';
import {
  getEarlyRiskList,
  getEarlyRiskDetail,
  EarlyRiskSummary,
  EarlyRiskResult,
  isDemoDataNotLoaded,
} from '../api/client';
import DemoDataBanner from '../components/DemoDataBanner';

function EarlyRisk() {
  const [employees, setEmployees] = useState<EarlyRiskSummary[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [detail, setDetail] = useState<EarlyRiskResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsDemoData, setNeedsDemoData] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    setNeedsDemoData(false);

    try {
      const data = await getEarlyRiskList();
      setEmployees(data.results);
    } catch (err) {
      if (isDemoDataNotLoaded(err)) {
        setNeedsDemoData(true);
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEmployee = async (employeeId: string) => {
    if (selectedEmployee === employeeId) {
      setSelectedEmployee(null);
      setDetail(null);
      return;
    }

    setSelectedEmployee(employeeId);
    setDetailLoading(true);

    try {
      const data = await getEarlyRiskDetail(employeeId);
      setDetail(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch details');
      setDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const getRiskBadgeClass = (level: string) => {
    switch (level) {
      case 'High':
        return 'badge badge-danger';
      case 'Medium':
        return 'badge badge-warning';
      default:
        return 'badge badge-success';
    }
  };

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'severity-high';
      case 'medium':
        return 'severity-medium';
      default:
        return 'severity-low';
    }
  };

  if (loading) {
    return (
      <div className="scenario-page">
        <h2>🔍 Scenario 3: Early Risk Detection</h2>
        <div className="card">
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (needsDemoData) {
    return (
      <div className="scenario-page">
        <h2>🔍 Scenario 3: Early Risk Detection</h2>
        <DemoDataBanner onLoaded={fetchEmployees} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="scenario-page">
        <h2>🔍 Scenario 3: Early Risk Detection</h2>
        <div className="card error-card">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="scenario-page">
      <h2>🔍 Scenario 3: Early Risk Detection</h2>
      <p className="subtitle">
        Detect early indicators of talent risk and disengagement before resignations occur.
      </p>

      <div className="scenario-layout early-risk-layout">
        <div className="form-section employee-list-section">
          <div className="card">
            <h3>Employees by Risk Score</h3>
            <p className="small-text">Click to view detailed analysis</p>
            <div className="early-risk-list">
              {employees.map((emp) => (
                <div
                  key={emp.employeeId}
                  className={`early-risk-item ${selectedEmployee === emp.employeeId ? 'selected' : ''}`}
                  onClick={() => handleSelectEmployee(emp.employeeId)}
                >
                  <div className="risk-item-header">
                    <div className="risk-item-info">
                      <span className="risk-item-name">{emp.name}</span>
                      <span className="risk-item-role">{emp.role}</span>
                    </div>
                    <div className="risk-item-score">
                      <span className={getRiskBadgeClass(emp.riskLevel)}>
                        {emp.riskLevel}
                      </span>
                      <span className="score-number">{emp.earlyRiskScore}</span>
                    </div>
                  </div>
                  {emp.topIndicators.length > 0 && (
                    <div className="risk-item-indicators">
                      {emp.topIndicators.slice(0, 2).map((indicator, i) => (
                        <span key={i} className="indicator-chip">
                          {indicator}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="results-section">
          {selectedEmployee ? (
            detailLoading ? (
              <div className="card">
                <p>Loading risk analysis...</p>
              </div>
            ) : detail ? (
              <>
                <div className="card">
                  <div className="detail-header">
                    <div>
                      <h3>{detail.name}</h3>
                      <p className="detail-role">{detail.role}</p>
                    </div>
                    <div className="detail-score">
                      <span className={getRiskBadgeClass(detail.riskLevel)}>
                        {detail.riskLevel} Risk
                      </span>
                      <span className="score-large">{detail.earlyRiskScore}/100</span>
                    </div>
                  </div>
                </div>

                {detail.likelyCauses.length > 0 && (
                  <div className="card">
                    <h4>⚠️ Likely Causes</h4>
                    <div className="cause-tags">
                      {detail.likelyCauses.map((cause, i) => (
                        <span key={i} className="cause-tag">
                          {cause}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="card">
                  <h4>📊 Risk Indicators</h4>
                  <div className="indicators-list">
                    {detail.indicators.map((ind, i) => (
                      <div key={i} className={`indicator-item ${getSeverityClass(ind.severity)}`}>
                        <span className="indicator-severity">{ind.severity}</span>
                        <span className="indicator-signal">{ind.signal}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <h4>💡 Recommended Interventions</h4>
                  <ul className="interventions-list">
                    {detail.recommendedInterventions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <div className="card">
                <p>Failed to load details</p>
              </div>
            )
          ) : (
            <div className="card placeholder-card">
              <h3>👈 Select an Employee</h3>
              <p>Click on an employee to view their early risk analysis.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card info-card">
        <h3>Early Risk Scoring Rules</h3>
        <table className="rules-table">
          <thead>
            <tr>
              <th>Signal Category</th>
              <th>Condition</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Burnout</td>
              <td>Overtime ≥ 20 hours/4 weeks</td>
              <td>+20</td>
            </tr>
            <tr>
              <td>Burnout</td>
              <td>High workload level</td>
              <td>+10</td>
            </tr>
            <tr>
              <td>Burnout</td>
              <td>PTO ≤ 1 day in 90 days</td>
              <td>+10</td>
            </tr>
            <tr>
              <td>Disengagement</td>
              <td>Engagement score ≤ 2.5</td>
              <td>+25</td>
            </tr>
            <tr>
              <td>Disengagement</td>
              <td>No manager check-ins</td>
              <td>+10</td>
            </tr>
            <tr>
              <td>Exit Risk</td>
              <td>Critical project ending (±14 days)</td>
              <td>+20</td>
            </tr>
            <tr>
              <td>Misalignment</td>
              <td>High mobility interest + stale role</td>
              <td>+15</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default EarlyRisk;
