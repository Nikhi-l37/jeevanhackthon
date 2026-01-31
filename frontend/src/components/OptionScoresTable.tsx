interface OptionScore {
  option: string;
  score: number;
  pros: string[];
  cons: string[];
  estimatedTimelineWeeks: number;
}

interface OptionScoresTableProps {
  optionScores: OptionScore[];
  recommendedOption: string;
}

function formatOptionName(option: string): string {
  return option
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function OptionScoresTable({ optionScores, recommendedOption }: OptionScoresTableProps) {
  return (
    <div className="option-scores-table">
      <table>
        <thead>
          <tr>
            <th>Option</th>
            <th>Score</th>
            <th>Timeline</th>
            <th>Pros</th>
            <th>Cons</th>
          </tr>
        </thead>
        <tbody>
          {optionScores.map((option) => (
            <tr
              key={option.option}
              className={option.option === recommendedOption ? 'recommended-row' : ''}
            >
              <td className="option-name">
                {formatOptionName(option.option)}
                {option.option === recommendedOption && (
                  <span className="recommended-badge">★ Recommended</span>
                )}
              </td>
              <td>
                <div className={`score-cell ${getScoreClass(option.score)}`}>
                  {option.score}
                </div>
              </td>
              <td className="timeline-cell">
                {option.estimatedTimelineWeeks} weeks
              </td>
              <td>
                <ul className="pros-list">
                  {option.pros.slice(0, 3).map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul className="cons-list">
                  {option.cons.slice(0, 3).map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function getScoreClass(score: number): string {
  if (score >= 70) return 'score-high';
  if (score >= 50) return 'score-medium';
  return 'score-low';
}

export default OptionScoresTable;
