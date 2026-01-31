// Expectation Balance Decision Logic - Rule-based scoring for Scenario 2

export type CandidateLevel = 'junior' | 'mid' | 'senior';
export type ExpectationLevel = 'low' | 'medium' | 'high';
export type PromotionExpectation = 'fast' | 'normal';
export type CompBand = 'low' | 'medium' | 'high';
export type EquityOrBonus = 'none' | 'small' | 'strong';

export interface ExpectationBalanceInput {
  candidateLevel: CandidateLevel;
  compExpectation: ExpectationLevel;
  promotionExpectation: PromotionExpectation;
  roleCriticality: ExpectationLevel;
  orgStabilityNeed: ExpectationLevel;
}

export interface OfferGuidance {
  compBand: CompBand;
  equityOrBonus: EquityOrBonus;
  growthPath: string;
  workImpactPlan: string;
}

export interface ExpectationBalanceResult {
  recommendedStrategy: string;
  offerGuidance: OfferGuidance;
  riskFlags: string[];
  reasons: string[];
  retentionLevers: string[];
}

// Determine compensation band based on inputs
function determineCompBand(input: ExpectationBalanceInput): CompBand {
  // Base comp band on role criticality
  let compBand: CompBand = 'medium';
  
  if (input.roleCriticality === 'high') {
    compBand = 'medium'; // At least medium for critical roles
    
    if (input.compExpectation === 'high') {
      compBand = 'high'; // High comp for critical role + high expectation
    }
  } else if (input.roleCriticality === 'medium') {
    if (input.compExpectation === 'high') {
      compBand = 'medium'; // Cap at medium for non-critical roles
    } else {
      compBand = input.compExpectation === 'low' ? 'low' : 'medium';
    }
  } else {
    // Low criticality
    compBand = input.compExpectation === 'high' ? 'medium' : 'low';
  }
  
  // Org stability override - don't overpay to maintain equity
  if (input.orgStabilityNeed === 'high' && compBand === 'high' && input.roleCriticality !== 'high') {
    compBand = 'medium';
  }
  
  return compBand;
}

// Determine equity/bonus level
function determineEquityOrBonus(input: ExpectationBalanceInput, compBand: CompBand): EquityOrBonus {
  // If we're capping comp due to org stability, compensate with equity/bonus
  if (input.orgStabilityNeed === 'high' && input.compExpectation === 'high' && compBand !== 'high') {
    return 'strong';
  }
  
  // Critical roles get equity/bonus
  if (input.roleCriticality === 'high') {
    return input.compExpectation === 'high' ? 'strong' : 'small';
  }
  
  // Senior candidates typically expect equity
  if (input.candidateLevel === 'senior') {
    return 'small';
  }
  
  // Fast promotion expectation - use bonus as milestone incentive
  if (input.promotionExpectation === 'fast') {
    return 'small';
  }
  
  return 'none';
}

// Generate growth path description
function generateGrowthPath(input: ExpectationBalanceInput): string {
  const { candidateLevel, promotionExpectation, orgStabilityNeed } = input;
  
  if (candidateLevel === 'junior') {
    if (promotionExpectation === 'fast') {
      return 'Accelerated 9-12 month milestone-based path to mid-level with clear competency gates and mentorship checkpoints';
    }
    return 'Structured 12-18 month development path with quarterly skill assessments and progression milestones';
  }
  
  if (candidateLevel === 'mid') {
    if (promotionExpectation === 'fast') {
      return 'High-visibility project assignments with 12-month senior track, contingent on demonstrated leadership and technical excellence';
    }
    return 'Progressive responsibility expansion over 18-24 months with leadership development and technical depth tracks';
  }
  
  // Senior
  if (promotionExpectation === 'fast') {
    return 'Staff/Principal track with scope expansion, requiring demonstrated org-wide impact within 12-18 months';
  }
  
  if (orgStabilityNeed === 'high') {
    return 'Technical leadership path with focus on knowledge transfer, architecture ownership, and team capability building';
  }
  
  return 'Dual-track progression (management or IC) with defined impact areas and influence expansion over 18-24 months';
}

// Generate work impact plan
function generateWorkImpactPlan(input: ExpectationBalanceInput): string {
  const { candidateLevel, roleCriticality, orgStabilityNeed } = input;
  
  if (roleCriticality === 'high') {
    if (candidateLevel === 'senior') {
      return 'Lead critical initiative ownership, drive architectural decisions, and mentor team members. Expected to deliver measurable business impact within first quarter.';
    }
    return 'Contribute to high-priority projects with increasing ownership. Clear path to leading key workstreams within 6 months.';
  }
  
  if (orgStabilityNeed === 'high') {
    return 'Focus on sustainable delivery with emphasis on documentation, knowledge sharing, and process improvement. Build institutional knowledge over time.';
  }
  
  if (candidateLevel === 'junior') {
    return 'Structured onboarding with pair programming, code reviews, and gradual feature ownership. First solo project expected within 3 months.';
  }
  
  return 'Balanced workload with mix of feature development and technical improvement. Opportunity to propose and lead improvement initiatives.';
}

// Generate risk flags
function generateRiskFlags(input: ExpectationBalanceInput): string[] {
  const risks: string[] = [];
  
  // Fast promotion + junior = unrealistic expectations
  if (input.promotionExpectation === 'fast' && input.candidateLevel === 'junior') {
    risks.push('Unrealistic promotion timeline for junior level - may lead to early dissatisfaction');
    risks.push('Fast progression expectations may clash with skill development needs');
  }
  
  // High comp expectation + low criticality = potential overpay
  if (input.compExpectation === 'high' && input.roleCriticality === 'low') {
    risks.push('Compensation expectations exceed role market rate - retention risk if not addressed');
  }
  
  // High org stability + fast promotion = potential conflict
  if (input.orgStabilityNeed === 'high' && input.promotionExpectation === 'fast') {
    risks.push('Fast growth expectations may conflict with organizational stability needs');
  }
  
  // Senior + fast promotion + high stability need
  if (input.candidateLevel === 'senior' && input.promotionExpectation === 'fast' && input.orgStabilityNeed === 'high') {
    risks.push('Senior candidates seeking rapid advancement may leave if growth plateaus');
  }
  
  // High comp + high stability = budget pressure
  if (input.compExpectation === 'high' && input.orgStabilityNeed === 'high') {
    risks.push('High compensation may create internal equity issues with existing team');
  }
  
  // Low criticality + high expectations = misalignment
  if (input.roleCriticality === 'low' && (input.compExpectation === 'high' || input.promotionExpectation === 'fast')) {
    risks.push('Candidate expectations may not align with role scope and growth ceiling');
  }
  
  return risks.slice(0, 4);
}

// Generate retention levers
function generateRetentionLevers(input: ExpectationBalanceInput): string[] {
  const levers: string[] = [];
  
  // Universal levers
  levers.push('Assign dedicated mentor for first 6 months');
  
  // Level-specific
  if (input.candidateLevel === 'junior') {
    levers.push('Provide annual learning budget ($2,000-3,000) for courses and certifications');
    levers.push('Quarterly career development check-ins with manager');
  } else if (input.candidateLevel === 'mid') {
    levers.push('Offer internal mobility opportunities across teams/projects');
    levers.push('Include in technical design discussions and architecture reviews');
  } else {
    levers.push('Provide conference speaking and thought leadership opportunities');
    levers.push('Grant autonomy in technical decisions within domain');
  }
  
  // Stability-focused
  if (input.orgStabilityNeed === 'high') {
    levers.push('Clear leveling rubric with transparent promotion criteria');
    levers.push('Recognition program for knowledge sharing and mentorship');
  }
  
  // Fast promotion seekers
  if (input.promotionExpectation === 'fast') {
    levers.push('Milestone-based reviews every 6 months with promotion eligibility');
    levers.push('Stretch assignments to demonstrate readiness for next level');
  }
  
  // High comp expectation
  if (input.compExpectation === 'high') {
    levers.push('Annual market adjustment reviews to maintain competitiveness');
    levers.push('Performance-based bonus tied to measurable outcomes');
  }
  
  return levers.slice(0, 6);
}

// Generate reasons for the strategy
function generateReasons(input: ExpectationBalanceInput, guidance: OfferGuidance): string[] {
  const reasons: string[] = [];
  
  // Comp band reasoning
  if (guidance.compBand === 'high') {
    reasons.push('High compensation band justified by critical role and competitive expectations');
  } else if (guidance.compBand === 'medium' && input.compExpectation === 'high') {
    reasons.push('Compensation capped at medium to maintain internal equity, offset by equity/bonus');
  }
  
  // Equity reasoning
  if (guidance.equityOrBonus === 'strong') {
    reasons.push('Strong equity/bonus component addresses high expectations while preserving salary structure');
  }
  
  // Growth path reasoning
  if (input.promotionExpectation === 'fast') {
    reasons.push('Milestone-based growth path provides fast-track opportunity with clear accountability');
  }
  
  // Stability reasoning
  if (input.orgStabilityNeed === 'high') {
    reasons.push('Strategy emphasizes sustainable growth to support organizational stability goals');
  }
  
  // Level reasoning
  reasons.push(`Tailored approach for ${input.candidateLevel}-level candidate with realistic expectations`);
  
  // Criticality reasoning
  if (input.roleCriticality === 'high') {
    reasons.push('Premium offer components reflect critical nature of the role');
  }
  
  return reasons.slice(0, 6);
}

// Determine recommended strategy label
function determineStrategy(input: ExpectationBalanceInput, guidance: OfferGuidance): string {
  const { candidateLevel, promotionExpectation, roleCriticality, orgStabilityNeed } = input;
  
  if (roleCriticality === 'high' && guidance.compBand === 'high') {
    return 'Critical role premium with retention safeguards';
  }
  
  if (promotionExpectation === 'fast' && candidateLevel !== 'senior') {
    return 'High-impact with milestone-based growth';
  }
  
  if (orgStabilityNeed === 'high') {
    return 'Sustainable growth offer with strong learning plan';
  }
  
  if (candidateLevel === 'senior' && guidance.equityOrBonus !== 'none') {
    return 'Senior talent package with equity incentives';
  }
  
  if (guidance.compBand === 'medium' && guidance.equityOrBonus === 'strong') {
    return 'Balanced compensation with performance upside';
  }
  
  return 'Standard competitive offer with growth opportunities';
}

// Main decision function
export function evaluateExpectationBalance(input: ExpectationBalanceInput): ExpectationBalanceResult {
  const compBand = determineCompBand(input);
  const equityOrBonus = determineEquityOrBonus(input, compBand);
  const growthPath = generateGrowthPath(input);
  const workImpactPlan = generateWorkImpactPlan(input);
  
  const offerGuidance: OfferGuidance = {
    compBand,
    equityOrBonus,
    growthPath,
    workImpactPlan,
  };
  
  const recommendedStrategy = determineStrategy(input, offerGuidance);
  const riskFlags = generateRiskFlags(input);
  const reasons = generateReasons(input, offerGuidance);
  const retentionLevers = generateRetentionLevers(input);
  
  return {
    recommendedStrategy,
    offerGuidance,
    riskFlags,
    reasons,
    retentionLevers,
  };
}
