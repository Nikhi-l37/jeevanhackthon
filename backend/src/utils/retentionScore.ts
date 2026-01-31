import { Employee } from '../store/memoryStore';

export interface RetentionRisk {
  employeeId: string;
  name: string;
  role: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reasons: string[];
  recommendedActions: string[];
}

interface RiskRule {
  condition: (emp: Employee) => boolean;
  points: number;
  reason: string;
  action: string;
}

// Define retention risk rules
const RISK_RULES: RiskRule[] = [
  {
    condition: (emp) => emp.tenureMonths > 24 && emp.promotionsCount === 0,
    points: 30,
    reason: 'Tenure > 24 months with no promotions',
    action: 'Schedule career growth discussion and define a promotion path',
  },
  {
    condition: (emp) => emp.performanceScore < 2.5,
    points: 20,
    reason: 'Performance score below threshold',
    action: 'Create coaching plan and remove blockers',
  },
  {
    condition: (emp) => emp.lastRoleChangeMonths > 18,
    points: 15,
    reason: 'No role change in over 18 months',
    action: 'Offer internal mobility options and training',
  },
  {
    condition: (emp) => emp.salaryBand === 'low',
    points: 15,
    reason: 'Compensation band is low for role',
    action: 'Review compensation band or provide retention incentives',
  },
];

/**
 * Determine risk level from score
 */
function getRiskLevel(score: number): 'Low' | 'Medium' | 'High' {
  if (score <= 30) return 'Low';
  if (score <= 60) return 'Medium';
  return 'High';
}

/**
 * Compute retention risk for an employee
 * Uses rule-based scoring with transparent reasons
 */
export function computeRetentionRisk(employee: Employee): RetentionRisk {
  let riskScore = 0;
  const reasons: string[] = [];
  const recommendedActions: string[] = [];

  // Apply each rule
  for (const rule of RISK_RULES) {
    if (rule.condition(employee)) {
      riskScore += rule.points;
      reasons.push(rule.reason);
      recommendedActions.push(rule.action);
    }
  }

  // Cap at 100
  riskScore = Math.min(riskScore, 100);

  return {
    employeeId: employee.id,
    name: employee.name,
    role: employee.role,
    riskScore,
    riskLevel: getRiskLevel(riskScore),
    reasons,
    recommendedActions,
  };
}
