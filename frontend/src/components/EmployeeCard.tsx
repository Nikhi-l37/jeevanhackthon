import { Employee } from '../api/client';

interface EmployeeCardProps {
  employee: Employee;
  isSelected: boolean;
  onClick: () => void;
}

function EmployeeCard({ employee, isSelected, onClick }: EmployeeCardProps) {
  return (
    <div
      className={`card employee-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <h4>{employee.name}</h4>
      <p className="role">{employee.role}</p>
      <div className="employee-meta">
        <span className="meta-item">
          📅 {employee.tenureMonths} months
        </span>
        <span className="meta-item">
          ⭐ {employee.performanceScore.toFixed(1)}
        </span>
        <span className={`salary-badge ${employee.salaryBand}`}>
          {employee.salaryBand}
        </span>
      </div>
    </div>
  );
}

export default EmployeeCard;
