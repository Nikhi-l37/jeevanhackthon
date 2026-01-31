import { useState, useEffect } from 'react';
import { getEmployees, getRetention, Employee, RetentionRisk, isDemoDataNotLoaded } from '../api/client';
import EmployeeCard from '../components/EmployeeCard';
import RiskCard from '../components/RiskCard';
import DemoDataBanner from '../components/DemoDataBanner';

function Retention() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [riskData, setRiskData] = useState<RetentionRisk | null>(null);
  const [loading, setLoading] = useState(true);
  const [riskLoading, setRiskLoading] = useState(false);
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
      const data = await getEmployees();
      setEmployees(data);
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

  const handleEmployeeClick = async (employeeId: string) => {
    if (selectedEmployee === employeeId) {
      setSelectedEmployee(null);
      setRiskData(null);
      return;
    }

    setSelectedEmployee(employeeId);
    setRiskLoading(true);
    
    try {
      const data = await getRetention(employeeId);
      setRiskData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk data');
      setRiskData(null);
    } finally {
      setRiskLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="retention-page">
        <h2>📊 Retention Analysis</h2>
        <div className="card">
          <p>Loading employees...</p>
        </div>
      </div>
    );
  }

  if (needsDemoData) {
    return (
      <div className="retention-page">
        <h2>📊 Retention Analysis</h2>
        <DemoDataBanner onLoaded={fetchEmployees} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="retention-page">
        <h2>📊 Retention Analysis</h2>
        <div className="card error-card">
          <p className="error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="retention-page">
      <h2>📊 Retention Analysis</h2>
      <p className="subtitle">
        Click on an employee to view their retention risk analysis.
      </p>

      <div className="retention-layout">
        <div className="employee-list">
          <h3>Employees ({employees.length})</h3>
          <div className="employee-grid">
            {employees.map((employee) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                isSelected={selectedEmployee === employee.id}
                onClick={() => handleEmployeeClick(employee.id)}
              />
            ))}
          </div>
        </div>

        <div className="risk-panel">
          {selectedEmployee ? (
            riskLoading ? (
              <div className="card">
                <p>Loading risk analysis...</p>
              </div>
            ) : riskData ? (
              <RiskCard risk={riskData} />
            ) : (
              <div className="card">
                <p>Failed to load risk data</p>
              </div>
            )
          ) : (
            <div className="card placeholder-card">
              <h3>👈 Select an Employee</h3>
              <p>Click on an employee card to view their retention risk analysis.</p>
            </div>
          )}
        </div>
      </div>

      <div className="card info-card">
        <h3>Risk Scoring Rules</h3>
        <table className="rules-table">
          <thead>
            <tr>
              <th>Condition</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tenure &gt; 24 months with no promotions</td>
              <td>+30</td>
            </tr>
            <tr>
              <td>Performance score below 2.5</td>
              <td>+20</td>
            </tr>
            <tr>
              <td>No role change in over 18 months</td>
              <td>+15</td>
            </tr>
            <tr>
              <td>Compensation band is low</td>
              <td>+15</td>
            </tr>
          </tbody>
        </table>
        <p className="note">
          Risk Levels: 0-30 = Low, 31-60 = Medium, 61-100 = High
        </p>
      </div>
    </div>
  );
}

export default Retention;
