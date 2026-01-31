import { RetentionRisk } from '../api/client';

interface RiskCardProps {
  risk: RetentionRisk;
}

function RiskCard({ risk }: RiskCardProps) {
  const getRiskClass = (level: string) => {
    switch (level) {
      case 'High':
        return 'risk-high';
      case 'Medium':
        return 'risk-medium';
      case 'Low':
        return 'risk-low';
      default:
        return '';
    }
  };

  return (
    <div className="card risk-card">
      <div className="risk-header">
        <div>
          <h3>{risk.name}</h3>
          <p className="role">{risk.role}</p>
        </div>
        <div className={`risk-badge ${getRiskClass(risk.riskLevel)}`}>
          <span className="risk-level">{risk.riskLevel}</span>
          <span className="risk-score">{risk.riskScore}/100</span>
        </div>
      </div>

      <div className="risk-meter">
        <div 
          className={`risk-meter-fill ${getRiskClass(risk.riskLevel)}`}
          style={{ width: `${risk.riskScore}%` }}
        />
      </div>

      {risk.reasons.length > 0 ? (
        <>
          <div className="risk-section">
            <h4>⚠️ Risk Factors</h4>
            <ul className="reason-list">
              {risk.reasons.map((reason, index) => (
                <li key={index}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="risk-section">
            <h4>💡 Recommended Actions</h4>
            <ul className="action-list">
              {risk.recommendedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="risk-section">
          <h4>✅ No Risk Factors Detected</h4>
          <p>This employee shows no current retention risk indicators.</p>
        </div>
      )}
    </div>
  );
}

export default RiskCard;
