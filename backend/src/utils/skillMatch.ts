import { Candidate } from '../store/memoryStore';
import { normalizeSkills, parseQueryTokens } from './normalize';

export interface MatchResult {
  candidateId: string;
  name: string;
  role: string;
  skills: string[];
  matchScore: number;
  matchedSkills: string[];
}

/**
 * Calculate skill match score between query and candidate
 * Score = (matchedSkills / queryTokens) * 100
 * Returns matched skills for transparency
 */
export function calculateSkillMatch(
  queryTokens: string[],
  candidateSkills: string[]
): { score: number; matchedSkills: string[] } {
  if (queryTokens.length === 0) {
    return { score: 0, matchedSkills: [] };
  }

  const normalizedCandidateSkills = normalizeSkills(candidateSkills);
  
  // Find intersection
  const matchedSkills: string[] = [];
  
  for (const token of queryTokens) {
    // Check if any candidate skill contains or matches the token
    const match = normalizedCandidateSkills.find(
      (skill) => skill === token || skill.includes(token) || token.includes(skill)
    );
    
    if (match) {
      // Return the original skill name for display
      const originalIndex = normalizedCandidateSkills.indexOf(match);
      matchedSkills.push(candidateSkills[originalIndex]);
    }
  }

  const score = Math.round((matchedSkills.length / queryTokens.length) * 100);
  
  return { score, matchedSkills };
}

/**
 * Match candidates against a query and return top results
 */
export function matchCandidates(
  query: string,
  candidates: Candidate[],
  topN: number = 10
): MatchResult[] {
  const queryTokens = parseQueryTokens(query);
  
  if (queryTokens.length === 0) {
    return [];
  }

  const results: MatchResult[] = candidates.map((candidate) => {
    const { score, matchedSkills } = calculateSkillMatch(queryTokens, candidate.skills);
    
    return {
      candidateId: candidate.id,
      name: candidate.name,
      role: candidate.role,
      skills: candidate.skills,
      matchScore: score,
      matchedSkills,
    };
  });

  // Sort by score descending, then by name for stability
  results.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.name.localeCompare(b.name);
  });

  // Return top N with score > 0
  return results.filter((r) => r.matchScore > 0).slice(0, topN);
}
