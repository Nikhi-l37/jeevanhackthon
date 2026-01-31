import { useState } from 'react';
import { evaluateCapabilityGap, CapabilityGapResult } from '../api/client';
import OptionScoresTable from '../components/OptionScoresTable';
import ResultCard from '../components/ResultCard';

type Urgency = 'immediate' | '1-3m' | '3-6m';
type Level = 'low' | 'medium' | 'high';

function CapabilityGap() {
  const [skill, setSkill] = useState('GenAI / LLM Engineering');
  const [gapCount, setGapCount] = useState(5);
  const [urgency, setUrgency] = useState<Urgency>('1-3m');
  const [internalAvailability, setInternalAvailability] = useState<Level>('medium');
  const [budget, setBudget] = useState<Level>('medium');

  const [result, setResult] = useState<CapabilityGapResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await evaluateCapabilityGap({
        skill,
        gapCount,
        urgency,
        internalAvailability,
        budget,
      });
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to evaluate');
    } finally {
      setLoading(false);
    }
  };

  const formatOptionName = (option: string) => {
    return option
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="scenario-page">
      <h2>🎯 Scenario 1: Capability Gap Analysis</h2>
      <p className="subtitle">
        Determine whether a capability gap should be addressed through external hiring,
        internal upskilling, role redesign, or contractors.
      </p>

      <div className="scenario-layout">
        <div className="form-section">
          <div className="card">
            <h3>Input Parameters</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="skill">Skill / Capability</label>
                <input
                  id="skill"
                  type="text"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  placeholder="e.g., GenAI / LLM Engineering"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gapCount">Gap Count (headcount needed)</label>
                <input
                  id="gapCount"
                  type="number"
                  min={1}
                  max={50}
                  value={gapCount}
                  onChange={(e) => setGapCount(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="urgency">Urgency</label>
                <select
                  id="urgency"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as Urgency)}
                >
                  <option value="immediate">Immediate</option>
                  <option value="1-3m">1-3 Months</option>
                  <option value="3-6m">3-6 Months</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="internalAvailability">Internal Talent Availability</label>
                <select
                  id="internalAvailability"
                  value={internalAvailability}
                  onChange={(e) => setInternalAvailability(e.target.value as Level)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="budget">Budget</label>
                <select
                  id="budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value as Level)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Gap'}
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
                <div className="recommendation-highlight">
                  <span className="recommendation-label">
                    {formatOptionName(result.recommendedOption)}
                  </span>
                  <span className="confidence-badge">
                    {result.confidence}% confidence
                  </span>
                </div>
              </ResultCard>

              <ResultCard title="Why This Recommendation" icon="💡" variant="info">
                <ul className="reasons-list">
                  {result.reasons.map((reason, i) => (
                    <li key={i}>{reason}</li>
                  ))}
                </ul>
              </ResultCard>

              <div className="card">
                <h4>📊 Option Comparison</h4>
                <OptionScoresTable
                  optionScores={result.optionScores}
                  recommendedOption={result.recommendedOption}
                />
              </div>

              <ResultCard title="Next Steps" icon="📋">
                <ol className="next-steps-list">
                  {result.nextSteps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </ResultCard>
            </>
          )}

          {!result && !error && (
            <div className="card placeholder-card">
              <h3>👈 Configure Parameters</h3>
              <p>Fill in the form and click "Analyze Gap" to get recommendations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CapabilityGap;
