/**
 * Scenario 3: Early Risk Detection
 * Detects early indicators of talent risk and disengagement
 */

import { Employee } from '../store/memoryStore';

export interface RiskIndicator {
  signal: string;
  severity: 'low' | 'medium' | 'high';
}

export interface EarlyRiskResult {
  employeeId: string;
  name: string;
  role: string;
  earlyRiskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  indicators: RiskIndicator[];
  likelyCauses: string[];
  recommendedInterventions: string[];
}

export interface EarlyRiskSummary {
  employeeId: string;
  name: string;
  role: string;
  earlyRiskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  topIndicators: string[];
}

/**
 * Compute early risk score and analysis for an employee
 */
export function computeEarlyRisk(employee: Employee): EarlyRiskResult {
  let score = 0;
  const indicators: RiskIndicator[] = [];
  const likelyCauses: string[] = [];

  // === BURNOUT SIGNALS ===
  let burnoutSignals = 0;

  // Overtime hours >= 20 → +20 (high severity)
  if (employee.overtimeHoursLast4Weeks >= 20) {
    score += 20;
    burnoutSignals++;
    indicators.push({
      signal: `High overtime: ${employee.overtimeHoursLast4Weeks} hours in last 4 weeks`,
      severity: 'high',
    });
  } else if (employee.overtimeHoursLast4Weeks >= 15) {
    score += 10;
    indicators.push({
      signal: `Elevated overtime: ${employee.overtimeHoursLast4Weeks} hours in last 4 weeks`,
      severity: 'medium',
    });
  }

  // Recent workload level = high → +10
  if (employee.recentWorkloadLevel === 'high') {
    score += 10;
    burnoutSignals++;
    indicators.push({
      signal: 'Recent workload level is high',
      severity: 'medium',
    });
  }

  // PTO days taken <= 1 in last 90 days → +10
  if (employee.ptoDaysTakenLast90Days <= 1) {
    score += 10;
    burnoutSignals++;
    indicators.push({
      signal: `Only ${employee.ptoDaysTakenLast90Days} PTO day(s) taken in last 90 days`,
      severity: 'medium',
    });
  }

  if (burnoutSignals >= 2) {
    likelyCauses.push('Burnout risk');
  }

  // === DISENGAGEMENT SIGNALS ===
  let disengagementSignals = 0;

  // Engagement score <= 2.5 → +25
  if (employee.engagementScore <= 2.5) {
    score += 25;
    disengagementSignals++;
    indicators.push({
      signal: `Low engagement score: ${employee.engagementScore.toFixed(1)}`,
      severity: 'high',
    });
  } else if (employee.engagementScore <= 3.0) {
    score += 10;
    indicators.push({
      signal: `Below-average engagement score: ${employee.engagementScore.toFixed(1)}`,
      severity: 'medium',
    });
  }

  // Manager check-ins == 0 → +10
  if (employee.managerCheckinsLastMonth === 0) {
    score += 10;
    disengagementSignals++;
    indicators.push({
      signal: 'No manager check-ins last month',
      severity: 'medium',
    });
  }

  // Recognition = low → +10
  if (employee.recognitionLast60Days === 'low') {
    score += 10;
    disengagementSignals++;
    indicators.push({
      signal: 'Low recognition in last 60 days',
      severity: 'medium',
    });
  }

  if (disengagementSignals >= 2 || employee.engagementScore <= 2.5) {
    likelyCauses.push('Disengagement risk');
  }

  // === POST-CRITICAL-PROJECT EXIT RISK ===
  // Project criticality = high AND projectEndInDays between -14 and +14 → +20
  if (
    employee.projectCriticality === 'high' &&
    employee.projectEndInDays >= -14 &&
    employee.projectEndInDays <= 14
  ) {
    score += 20;
    const timing = employee.projectEndInDays < 0 
      ? `ended ${Math.abs(employee.projectEndInDays)} days ago`
      : employee.projectEndInDays === 0 
        ? 'ending today'
        : `ending in ${employee.projectEndInDays} days`;
    indicators.push({
      signal: `Critical project ${timing}`,
      severity: 'high',
    });
    likelyCauses.push('Post-project exit risk');
  }

  // === MISALIGNMENT SIGNALS ===
  // Internal mobility interest = high AND lastRoleChangeMonths > 18 → +15
  if (
    employee.internalMobilityInterest === 'high' &&
    employee.lastRoleChangeMonths > 18
  ) {
    score += 15;
    indicators.push({
      signal: `High mobility interest, no role change in ${employee.lastRoleChangeMonths} months`,
      severity: 'medium',
    });
    likelyCauses.push('Career misalignment');
  }

  // Cap score at 0-100
  score = Math.min(100, Math.max(0, score));

  // Determine risk level
  let riskLevel: 'Low' | 'Medium' | 'High';
  if (score <= 30) {
    riskLevel = 'Low';
  } else if (score <= 60) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  // Generate recommended interventions based on causes
  const recommendedInterventions: string[] = [];

  if (likelyCauses.includes('Burnout risk')) {
    recommendedInterventions.push('Reduce workload or reassign tasks');
    recommendedInterventions.push('Encourage taking PTO');
    recommendedInterventions.push('Review project timeline and resource allocation');
  }

  if (likelyCauses.includes('Disengagement risk')) {
    recommendedInterventions.push('Schedule regular 1:1 check-ins with manager');
    recommendedInterventions.push('Provide recognition for recent contributions');
    recommendedInterventions.push('Discuss career goals and growth opportunities');
  }

  if (likelyCauses.includes('Post-project exit risk')) {
    recommendedInterventions.push('Discuss next project assignment proactively');
    recommendedInterventions.push('Consider retention bonus for critical talent');
    recommendedInterventions.push('Assign mentor or sponsor for career guidance');
  }

  if (likelyCauses.includes('Career misalignment')) {
    recommendedInterventions.push('Explore internal transfer opportunities');
    recommendedInterventions.push('Create development plan for desired role');
    recommendedInterventions.push('Consider role redesign or stretch assignments');
  }

  // Add general interventions for medium+ risk
  if (riskLevel !== 'Low' && recommendedInterventions.length === 0) {
    recommendedInterventions.push('Conduct stay interview');
    recommendedInterventions.push('Review compensation and benefits');
  }

  return {
    employeeId: employee.id,
    name: employee.name,
    role: employee.role,
    earlyRiskScore: score,
    riskLevel,
    indicators,
    likelyCauses,
    recommendedInterventions,
  };
}

/**
 * Get summary list of all employees sorted by risk score
 */
export function getEarlyRiskList(employees: Employee[]): EarlyRiskSummary[] {
  return employees
    .map((emp) => {
      const result = computeEarlyRisk(emp);
      return {
        employeeId: result.employeeId,
        name: result.name,
        role: result.role,
        earlyRiskScore: result.earlyRiskScore,
        riskLevel: result.riskLevel,
        topIndicators: result.indicators.slice(0, 3).map((i) => i.signal),
      };
    })
    .sort((a, b) => b.earlyRiskScore - a.earlyRiskScore);
}
