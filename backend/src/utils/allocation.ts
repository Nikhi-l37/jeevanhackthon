/**
 * Scenario 4: Talent Allocation & Prioritization
 * Allocate scarce skills across competing programs
 */

import { Program } from '../store/memoryStore';

export interface AllocationInput {
  scarceSkill: string;
  availablePeople: number;
}

export interface ProgramRanking {
  programId: string;
  name: string;
  department: string;
  priorityScore: number;
  reasonSummary: string;
  suggestedAllocation: number;
  riskIfUnfilled: 'low' | 'medium' | 'high';
}

export interface AllocationResult {
  scarceSkill: string;
  availablePeople: number;
  programRankings: ProgramRanking[];
  orgActions: string[];
}

/**
 * Compute priority score for a program
 */
function computePriorityScore(
  program: Program,
  scarceSkill: string,
  totalAvailable: number
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // Business impact: low=20, medium=50, high=80
  const impactScores = { low: 20, medium: 50, high: 80 };
  score += impactScores[program.businessImpact];
  reasons.push(`${program.businessImpact} business impact`);

  // Urgency: low=10, medium=30, high=50
  const urgencyScores = { low: 10, medium: 30, high: 50 };
  score += urgencyScores[program.urgency];
  if (program.urgency === 'high') {
    reasons.push('high urgency');
  }

  // Deadline bonus: <= 4 weeks +20, <= 8 weeks +10
  if (program.deadlineInWeeks <= 4) {
    score += 20;
    reasons.push(`tight deadline (${program.deadlineInWeeks} weeks)`);
  } else if (program.deadlineInWeeks <= 8) {
    score += 10;
    reasons.push(`near-term deadline (${program.deadlineInWeeks} weeks)`);
  }

  // Scarcity pressure: if headcount > available, +10
  if (program.headcountNeeded > totalAvailable) {
    score += 10;
    reasons.push('high demand vs supply');
  }

  // Boost if program requires the scarce skill
  const normalizedSkill = scarceSkill.toLowerCase().trim();
  const hasSkill = program.requiredSkills.some((s) => {
    const normalized = s.toLowerCase();
    return (
      normalized.includes(normalizedSkill) ||
      normalizedSkill.includes(normalized)
    );
  });

  if (hasSkill) {
    score += 15;
    reasons.push(`requires ${scarceSkill}`);
  }

  // Clamp to 0-100
  score = Math.min(100, Math.max(0, score));

  return { score, reasons };
}

/**
 * Allocate scarce talent across programs
 */
export function computeAllocation(
  input: AllocationInput,
  programs: Program[]
): AllocationResult {
  const { scarceSkill, availablePeople } = input;

  // Filter programs that might need this skill (broad match)
  const normalizedSkill = scarceSkill.toLowerCase().trim();
  const relevantPrograms = programs.filter((p) =>
    p.requiredSkills.some((s) => {
      const normalized = s.toLowerCase();
      return (
        normalized.includes(normalizedSkill) ||
        normalizedSkill.includes(normalized)
      );
    })
  );

  // Compute priority scores
  const scoredPrograms = relevantPrograms.map((program) => {
    const { score, reasons } = computePriorityScore(
      program,
      scarceSkill,
      availablePeople
    );
    return {
      program,
      priorityScore: score,
      reasonSummary: reasons.join(', '),
    };
  });

  // Sort by priority score descending
  scoredPrograms.sort((a, b) => b.priorityScore - a.priorityScore);

  // Allocate people
  let remaining = availablePeople;
  const rankings: ProgramRanking[] = scoredPrograms.map(
    ({ program, priorityScore, reasonSummary }) => {
      const allocation = Math.min(remaining, program.headcountNeeded);
      remaining -= allocation;

      // Determine risk if unfilled
      const unfilledCount = program.headcountNeeded - allocation;
      let riskIfUnfilled: 'low' | 'medium' | 'high';

      if (unfilledCount === 0) {
        riskIfUnfilled = 'low';
      } else if (priorityScore >= 70 && unfilledCount > 0) {
        riskIfUnfilled = 'high';
      } else if (priorityScore >= 50 && unfilledCount > 0) {
        riskIfUnfilled = 'medium';
      } else {
        riskIfUnfilled = 'low';
      }

      return {
        programId: program.id,
        name: program.name,
        department: program.department,
        priorityScore,
        reasonSummary,
        suggestedAllocation: allocation,
        riskIfUnfilled,
      };
    }
  );

  // Generate org actions based on results
  const orgActions: string[] = [];
  const totalNeeded = relevantPrograms.reduce(
    (sum, p) => sum + p.headcountNeeded,
    0
  );
  const totalAllocated = availablePeople - remaining;
  const unfilledTotal = totalNeeded - totalAllocated;

  if (unfilledTotal > 0) {
    orgActions.push(
      `${unfilledTotal} position(s) remain unfilled - consider contractors for overflow`
    );
  }

  if (totalNeeded > availablePeople * 1.5) {
    orgActions.push(
      'Launch internal upskilling cohort to build pipeline for this skill'
    );
  }

  if (relevantPrograms.length > 3) {
    orgActions.push(
      'Create shared platform team to reduce duplicate demand across programs'
    );
  }

  const highRiskUnfilled = rankings.filter(
    (r) => r.riskIfUnfilled === 'high' && r.suggestedAllocation < 
      relevantPrograms.find((p) => p.id === r.programId)!.headcountNeeded
  );

  if (highRiskUnfilled.length > 0) {
    orgActions.push(
      `Prioritize hiring or contractors for: ${highRiskUnfilled.map((r) => r.name).join(', ')}`
    );
  }

  if (orgActions.length === 0 && unfilledTotal === 0) {
    orgActions.push('Allocation is balanced - continue monitoring demand');
  }

  return {
    scarceSkill,
    availablePeople,
    programRankings: rankings,
    orgActions,
  };
}
