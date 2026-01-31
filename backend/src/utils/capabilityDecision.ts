// Capability Gap Decision Logic - Rule-based scoring for Scenario 1

export type Urgency = 'immediate' | '1-3m' | '3-6m';
export type Availability = 'low' | 'medium' | 'high';
export type Budget = 'low' | 'medium' | 'high';
export type CapabilityOption = 'external_hiring' | 'internal_upskilling' | 'role_redesign' | 'contractors';

export interface CapabilityGapInput {
  skill: string;
  gapCount: number;
  urgency: Urgency;
  internalAvailability: Availability;
  budget: Budget;
}

export interface OptionScore {
  option: CapabilityOption;
  score: number;
  pros: string[];
  cons: string[];
  estimatedTimelineWeeks: number;
}

export interface CapabilityGapResult {
  recommendedOption: CapabilityOption;
  confidence: number;
  reasons: string[];
  optionScores: OptionScore[];
  nextSteps: string[];
}

// Clamp value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

// Calculate scores for all options
function calculateOptionScores(input: CapabilityGapInput): Map<CapabilityOption, number> {
  const scores = new Map<CapabilityOption, number>([
    ['external_hiring', 50],
    ['internal_upskilling', 50],
    ['role_redesign', 50],
    ['contractors', 50],
  ]);

  // Urgency adjustments
  switch (input.urgency) {
    case 'immediate':
      scores.set('contractors', scores.get('contractors')! + 25);
      scores.set('external_hiring', scores.get('external_hiring')! + 15);
      scores.set('internal_upskilling', scores.get('internal_upskilling')! - 20);
      scores.set('role_redesign', scores.get('role_redesign')! - 10);
      break;
    case '1-3m':
      scores.set('contractors', scores.get('contractors')! + 10);
      scores.set('external_hiring', scores.get('external_hiring')! + 10);
      scores.set('internal_upskilling', scores.get('internal_upskilling')! + 5);
      break;
    case '3-6m':
      scores.set('contractors', scores.get('contractors')! - 10);
      scores.set('external_hiring', scores.get('external_hiring')! - 5);
      scores.set('internal_upskilling', scores.get('internal_upskilling')! + 20);
      scores.set('role_redesign', scores.get('role_redesign')! + 10);
      break;
  }

  // Internal availability adjustments
  switch (input.internalAvailability) {
    case 'high':
      scores.set('internal_upskilling', scores.get('internal_upskilling')! + 25);
      scores.set('role_redesign', scores.get('role_redesign')! + 10);
      scores.set('external_hiring', scores.get('external_hiring')! - 10);
      scores.set('contractors', scores.get('contractors')! - 10);
      break;
    case 'medium':
      scores.set('internal_upskilling', scores.get('internal_upskilling')! + 10);
      scores.set('role_redesign', scores.get('role_redesign')! + 5);
      break;
    case 'low':
      scores.set('internal_upskilling', scores.get('internal_upskilling')! - 20);
      scores.set('role_redesign', scores.get('role_redesign')! - 10);
      scores.set('external_hiring', scores.get('external_hiring')! + 15);
      scores.set('contractors', scores.get('contractors')! + 20);
      break;
  }

  // Budget adjustments
  switch (input.budget) {
    case 'low':
      scores.set('internal_upskilling', scores.get('internal_upskilling')! + 15);
      scores.set('role_redesign', scores.get('role_redesign')! + 10);
      scores.set('external_hiring', scores.get('external_hiring')! - 15);
      scores.set('contractors', scores.get('contractors')! - 10);
      break;
    case 'high':
      scores.set('external_hiring', scores.get('external_hiring')! + 10);
      scores.set('contractors', scores.get('contractors')! + 10);
      break;
  }

  // Gap count adjustments
  if (input.gapCount >= 10) {
    scores.set('role_redesign', scores.get('role_redesign')! + 10);
    scores.set('contractors', scores.get('contractors')! + 10);
    scores.set('external_hiring', scores.get('external_hiring')! - 10);
    scores.set('internal_upskilling', scores.get('internal_upskilling')! - 5);
  } else if (input.gapCount >= 3) {
    scores.set('external_hiring', scores.get('external_hiring')! + 5);
    scores.set('internal_upskilling', scores.get('internal_upskilling')! + 5);
  } else {
    scores.set('external_hiring', scores.get('external_hiring')! + 10);
    scores.set('contractors', scores.get('contractors')! + 5);
  }

  // Clamp all scores to 0-100
  for (const [option, score] of scores) {
    scores.set(option, clamp(score, 0, 100));
  }

  return scores;
}

// Get pros for each option
function getPros(option: CapabilityOption, input: CapabilityGapInput): string[] {
  const pros: Record<CapabilityOption, string[]> = {
    external_hiring: [
      'Brings fresh perspectives and external expertise',
      'No dependency on existing team capacity',
      'Can hire for exact skill match',
      'Permanent solution to capability gap',
    ],
    internal_upskilling: [
      'Leverages existing organizational knowledge',
      'Improves employee engagement and retention',
      'Lower long-term cost than hiring',
      'Builds sustainable internal capability',
    ],
    role_redesign: [
      'Optimizes existing workforce allocation',
      'Can be implemented with minimal budget',
      'Reduces redundancy in roles',
      'Flexible approach that adapts to needs',
    ],
    contractors: [
      'Fastest time to capability',
      'Flexible commitment level',
      'No long-term employment obligations',
      'Access to specialized expertise quickly',
    ],
  };

  const result = [...pros[option]];
  
  // Add context-specific pros
  if (option === 'internal_upskilling' && input.internalAvailability === 'high') {
    result.push('Strong internal talent pool available for development');
  }
  if (option === 'contractors' && input.urgency === 'immediate') {
    result.push('Can start within days to address urgent needs');
  }
  
  return result.slice(0, 4);
}

// Get cons for each option
function getCons(option: CapabilityOption, input: CapabilityGapInput): string[] {
  const cons: Record<CapabilityOption, string[]> = {
    external_hiring: [
      'Longer time to onboard (6-12 weeks typical)',
      'Higher upfront costs (recruitment, signing)',
      'Cultural fit risk',
      'Market competition for talent',
    ],
    internal_upskilling: [
      'Takes time to develop skills (8-16 weeks)',
      'Requires training investment',
      'May impact current project delivery',
      'Not suitable for immediate needs',
    ],
    role_redesign: [
      'May cause temporary disruption',
      'Requires change management effort',
      'Could affect team morale if not handled well',
      'Limited by existing skill sets',
    ],
    contractors: [
      'Higher hourly/daily rates',
      'No long-term knowledge retention',
      'Less commitment to company goals',
      'Dependency risk if contract ends',
    ],
  };

  const result = [...cons[option]];
  
  // Add context-specific cons
  if (option === 'internal_upskilling' && input.internalAvailability === 'low') {
    result.unshift('Limited internal candidates available');
  }
  if (option === 'external_hiring' && input.budget === 'low') {
    result.unshift('Budget constraints may limit candidate pool');
  }
  
  return result.slice(0, 4);
}

// Calculate estimated timeline in weeks
function getEstimatedTimeline(option: CapabilityOption, urgency: Urgency): number {
  const baseTimelines: Record<CapabilityOption, [number, number]> = {
    external_hiring: [6, 12],
    internal_upskilling: [8, 16],
    role_redesign: [4, 10],
    contractors: [1, 4],
  };

  const [min, max] = baseTimelines[option];
  
  // Adjust based on urgency
  switch (urgency) {
    case 'immediate':
      return min;
    case '1-3m':
      return Math.round((min + max) / 2);
    case '3-6m':
      return max;
  }
}

// Generate reasons for the recommendation
function generateReasons(
  recommendedOption: CapabilityOption,
  input: CapabilityGapInput,
  scores: Map<CapabilityOption, number>
): string[] {
  const reasons: string[] = [];

  // Urgency-based reasons
  if (input.urgency === 'immediate') {
    if (recommendedOption === 'contractors') {
      reasons.push('Immediate urgency favors contractors who can start within days');
    } else if (recommendedOption === 'external_hiring') {
      reasons.push('Urgent need pushes toward external hiring despite longer timeline');
    }
  } else if (input.urgency === '3-6m') {
    if (recommendedOption === 'internal_upskilling') {
      reasons.push('Longer timeline (3-6 months) allows for internal skill development');
    }
  }

  // Availability-based reasons
  if (input.internalAvailability === 'high') {
    if (recommendedOption === 'internal_upskilling') {
      reasons.push('High internal availability makes upskilling the most efficient option');
    } else if (recommendedOption === 'role_redesign') {
      reasons.push('Strong internal talent pool enables effective role redistribution');
    }
  } else if (input.internalAvailability === 'low') {
    if (recommendedOption === 'external_hiring' || recommendedOption === 'contractors') {
      reasons.push('Low internal availability necessitates external talent sourcing');
    }
  }

  // Budget-based reasons
  if (input.budget === 'low') {
    if (recommendedOption === 'internal_upskilling') {
      reasons.push('Budget constraints favor upskilling existing employees over new hires');
    } else if (recommendedOption === 'role_redesign') {
      reasons.push('Role redesign offers cost-effective capability realignment');
    }
  } else if (input.budget === 'high') {
    if (recommendedOption === 'external_hiring') {
      reasons.push('Sufficient budget enables competitive external hiring');
    }
  }

  // Gap count reasons
  if (input.gapCount >= 10) {
    reasons.push(`Large gap count (${input.gapCount}) suggests structural approach needed`);
  } else if (input.gapCount <= 2) {
    reasons.push(`Small gap count (${input.gapCount}) can be addressed with targeted hiring`);
  }

  // Score-based reason
  const topScore = scores.get(recommendedOption)!;
  reasons.push(`${recommendedOption.replace('_', ' ')} scored highest at ${topScore}/100 based on your parameters`);

  // Skill-specific reason
  reasons.push(`Addresses the "${input.skill}" capability gap effectively`);

  return reasons.slice(0, 6);
}

// Generate next steps based on recommendation
function generateNextSteps(recommendedOption: CapabilityOption, input: CapabilityGapInput): string[] {
  const steps: Record<CapabilityOption, string[]> = {
    external_hiring: [
      'Define detailed job requirements and must-have skills',
      'Engage recruiting team or external agency',
      'Set competitive compensation package based on market data',
      'Prepare technical assessment and interview process',
      'Plan 30-60-90 day onboarding program',
      'Identify internal mentor/buddy for new hire',
    ],
    internal_upskilling: [
      'Identify high-potential employees for development',
      'Create personalized learning paths with milestones',
      'Allocate dedicated training time (20% of work hours)',
      'Partner with L&D for formal training programs',
      'Set up mentorship with external experts if needed',
      'Define success metrics and checkpoint reviews',
    ],
    role_redesign: [
      'Map current skills across the team',
      'Identify responsibilities that can be redistributed',
      'Draft new role definitions and expectations',
      'Communicate changes transparently to affected employees',
      'Provide transition support and training as needed',
      'Monitor workload balance post-redesign',
    ],
    contractors: [
      'Define clear scope of work and deliverables',
      'Identify preferred vendors or freelance platforms',
      'Set budget and contract duration parameters',
      'Prepare knowledge transfer documentation',
      'Assign internal point of contact for contractors',
      'Plan for knowledge capture before contract ends',
    ],
  };

  return steps[recommendedOption].slice(0, 6);
}

// Main decision function
export function evaluateCapabilityGap(input: CapabilityGapInput): CapabilityGapResult {
  const scores = calculateOptionScores(input);
  
  // Sort options by score
  const sortedOptions = Array.from(scores.entries()).sort((a, b) => b[1] - a[1]);
  
  const recommendedOption = sortedOptions[0][0];
  const topScore = sortedOptions[0][1];
  const secondScore = sortedOptions[1][1];
  
  // Calculate confidence based on score difference
  const confidence = clamp((topScore - secondScore) * 5, 0, 100);
  
  // Build option scores array
  const optionScores: OptionScore[] = sortedOptions.map(([option, score]) => ({
    option,
    score,
    pros: getPros(option, input),
    cons: getCons(option, input),
    estimatedTimelineWeeks: getEstimatedTimeline(option, input.urgency),
  }));
  
  const reasons = generateReasons(recommendedOption, input, scores);
  const nextSteps = generateNextSteps(recommendedOption, input);
  
  return {
    recommendedOption,
    confidence,
    reasons,
    optionScores,
    nextSteps,
  };
}
