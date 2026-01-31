import { useState } from 'react';
import { evaluateExpectationBalance, ExpectationBalanceResult } from '../api/client';
import ResultCard from '../components/ResultCard';

type CandidateLevel = 'junior' | 'mid' | 'senior';
type Level = 'low' | 'medium' | 'high';
type PromotionExpectation = 'fast' | 'normal';

function ExpectationBalance() {
  const [candidateLevel, setCandidateLevel] = useState<CandidateLevel>('mid');
  const [compExpectation, setCompExpectation] = useState<Level>('high');
  const [promotionExpectation, setPromotionExpectation] = useState<PromotionExpectation>('fast');
  const [roleCriticality, setRoleCriticality] = useState<Level>('high');
  const [orgStabilityNeed, setOrgStabilityNeed] = useState<Level>('high');

  const [result, setResult] = useState<ExpectationBalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await evaluateExpectationBalance({
        candidateLevel,
        compExpectation,
        promotionExpectation,
        roleCriticality,
        orgStabilityNeed,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate');
    } finally {
      setLoading(false);
    }
  };

  const formatBand = (band: string) => {
    return band.charAt(0).toUpperCase() + band.slice(1);
  };

  return (
    <div className="scenario-page">
      <h2>⚖️ Scenario 2: Expectation Balance</h2>
      <p className="subtitle">
        Balance candidate expectations (compensation, promotion, impact) with 
        organizational sustainability (retention, realistic growth, stability).
      </p>

      <div className="scenario-layout">
        <div className="form-section">
          <div className="card">
            <h3>Input Parameters</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="candidateLevel">Candidate Level</label>
                <select
                  id="candidateLevel"
                  value={candidateLevel}
                  onChange={(e) => setCandidateLevel(e.target.value as CandidateLevel)}
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="compExpectation">Compensation Expectation</label>
                <select
                  id="compExpectation"
                  value={compExpectation}
                  onChange={(e) => setCompExpectation(e.target.value as Level)}
                >
                  <option value="low">Low (below market)</option>
                  <option value="medium">Medium (at market)</option>
                  <option value="high">High (above market)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="promotionExpectation">Promotion Expectation</label>
                <select
                  id="promotionExpectation"
                  value={promotionExpectation}
                  onChange={(e) => setPromotionExpectation(e.target.value as PromotionExpectation)}
                >
                  <option value="normal">Normal (standard timeline)</option>
                  <option value="fast">Fast (accelerated growth)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="roleCriticality">Role Criticality</label>
                <select
                  id="roleCriticality"
                  value={roleCriticality}
                  onChange={(e) => setRoleCriticality(e.target.value as Level)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (critical hire)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="orgStabilityNeed">Organizational Stability Need</label>
                <select
                  id="orgStabilityNeed"
                  value={orgStabilityNeed}
                  onChange={(e) => setOrgStabilityNeed(e.target.value as Level)}
                >
                  <option value="low">Low (flexible)</option>
                  <option value="medium">Medium</option>
                  <option value="high">High (must retain long-term)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Evaluating...' : 'Evaluate Balance'}
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
              <ResultCard
                title="Recommended Strategy"
                icon="🎯"
                variant="success"
              >
                <div className="strategy-highlight">
                  {result.recommendedStrategy}
                </div>
              </ResultCard>

              <ResultCard title="Offer Guidance" icon="💼" variant="info">
                <div className="offer-guidance">
                  <div className="guidance-item">
                    <span className="guidance-label">Compensation Band:</span>
                    <span className={`guidance-value band-${result.offerGuidance.compBand}`}>
                      {formatBand(result.offerGuidance.compBand)}
                    </span>
                  </div>
                  <div className="guidance-item">
                    <span className="guidance-label">Equity / Bonus:</span>
                    <span className={`guidance-value equity-${result.offerGuidance.equityOrBonus}`}>
                      {formatBand(result.offerGuidance.equityOrBonus)}
                    </span>
                  </div>
                  <div className="guidance-item full-width">
                    <span className="guidance-label">Growth Path:</span>
                    <p className="guidance-text">{result.offerGuidance.growthPath}</p>
                  </div>
                  <div className="guidance-item full-width">
                    <span className="guidance-label">Work Impact Plan:</span>
                    <p className="guidance-text">{result.offerGuidance.workImpactPlan}</p>
                  </div>
                </div>
              </ResultCard>

              {result.riskFlags.length > 0 && (
                <ResultCard title="Risk Flags" icon="⚠️" variant="warning">
                  <ul className="risk-flags-list">
                    {result.riskFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </ResultCard>
              )}

              <ResultCard title="Why This Strategy" icon="💡">
                <ul className="reasons-list">
                  {result.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </ResultCard>

              <ResultCard title="Retention Levers" icon="🔧" variant="info">
                <ul className="retention-levers-list">
                  {result.retentionLevers.map((lever, i) => (
                    <li key={i}>{lever}</li>
                  ))}
                </ul>
              </ResultCard>
            </>
          )}

          {!result && !error && (
            <div className="card placeholder-card">
              <h3>👈 Configure Parameters</h3>
              <p>Fill in the form and click "Evaluate Balance" to get recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpectationBalance;
