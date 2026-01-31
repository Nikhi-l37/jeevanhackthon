import { ReactNode } from 'react';

interface ResultCardProps {
  title: string;
  icon?: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
  children: ReactNode;
}

function ResultCard({ title, icon, variant = 'default', children }: ResultCardProps) {
  return (
    <div className={`card result-card result-card-${variant}`}>
      <h4>
        {icon && <span className="result-icon">{icon}</span>}
        {title}
      </h4>
      <div className="result-content">{children}</div>
    </div>
  );
}

export default ResultCard;
