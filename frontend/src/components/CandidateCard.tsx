import { MatchResult } from '../api/client';

interface CandidateCardProps {
  candidate: MatchResult;
}

function CandidateCard({ candidate }: CandidateCardProps) {
  const getScoreClass = (score: number) => {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="card candidate-card">
      <div className="candidate-header">
        <div className="candidate-info">
          <h4>{candidate.name}</h4>
          <p className="role">{candidate.role}</p>
        </div>
        <div className={`score-badge ${getScoreClass(candidate.matchScore)}`}>
          {candidate.matchScore}%
        </div>
      </div>

      <div className="skills-section">
        <p className="skills-label">Skills:</p>
        <div className="skills-chips">
          {candidate.skills.map((skill) => (
            <span
              key={skill}
              className={`skill-chip ${
                candidate.matchedSkills.includes(skill) ? 'matched' : ''
              }`}
            >
              {skill}
              {candidate.matchedSkills.includes(skill) && ' ✓'}
            </span>
          ))}
        </div>
      </div>

      <div className="match-info">
        <span className="matched-count">
          {candidate.matchedSkills.length} skill{candidate.matchedSkills.length !== 1 ? 's' : ''} matched
        </span>
      </div>
    </div>
  );
}

export default CandidateCard;
