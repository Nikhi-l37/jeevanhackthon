import { useState } from 'react';
import { matchCandidates, MatchResult } from '../api/client';
import CandidateCard from '../components/CandidateCard';

function Match() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MatchResult[]>([]);
  const [searchedQuery, setSearchedQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter skills to search');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await matchCandidates(query);
      setResults(response.results);
      setSearchedQuery(response.query);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const suggestedSearches = [
    'react, typescript',
    'python, machine learning',
    'aws, kubernetes, docker',
    'java, spring',
    'javascript, node',
  ];

  return (
    <div className="match-page">
      <h2>🔍 Candidate Matching</h2>
      <p className="subtitle">
        Search candidates by skills. Scoring is based on skill overlap percentage.
      </p>

      <div className="card search-card">
        <form onSubmit={handleSearch}>
          <div className="search-input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter skills (e.g., react, typescript, node)"
              className="search-input"
            />
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        <div className="suggested-searches">
          <span>Try: </span>
          {suggestedSearches.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setQuery(suggestion)}
              className="suggestion-chip"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="card error-card">
          <p className="error">{error}</p>
          {error.includes('Demo data not loaded') && (
            <p>Please go to Dashboard and click "Load Demo Data" first.</p>
          )}
        </div>
      )}

      {hasSearched && !error && (
        <div className="results-section">
          <h3>
            Results for "{searchedQuery}" 
            <span className="result-count">({results.length} candidates)</span>
          </h3>

          {results.length === 0 ? (
            <div className="card">
              <p>No candidates found matching those skills. Try different keywords.</p>
            </div>
          ) : (
            <div className="candidate-grid">
              {results.map((candidate) => (
                <CandidateCard key={candidate.candidateId} candidate={candidate} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="card info-card">
        <h3>How Matching Works</h3>
        <ul>
          <li>Enter skills separated by commas or spaces</li>
          <li>Each skill is matched against candidate profiles</li>
          <li><strong>Match Score</strong> = (matched skills / total query skills) × 100</li>
          <li>Results are sorted by score (highest first)</li>
          <li>Matched skills are highlighted for transparency</li>
        </ul>
      </div>
    </div>
  );
}

export default Match;
