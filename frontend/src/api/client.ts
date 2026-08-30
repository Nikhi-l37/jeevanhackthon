// Backend API Base URL configured via VITE_ environment variable
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:4000').replace(/\/+$/, '');

// Custom error class for API errors
export class ApiError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.code = code;
    this.name = 'ApiError';
  }
}

// Helper to safely parse API error response (handles HTML error pages like 404, 405, 502 gracefully)
async function parseError(response: Response, defaultMessage: string): Promise<ApiError> {
  try {
    const text = await response.text();
    try {
      const data = JSON.parse(text);
      const message =
        data.messages?.join(', ') || data.message || data.error || defaultMessage;
      return new ApiError(message, data.error || data.code || 'API_ERROR');
    } catch {
      if (response.status === 405) {
        return new ApiError(
          `405 Method Not Allowed. The backend server might not be running or routing this request.`,
          'METHOD_NOT_ALLOWED'
        );
      }
      if (response.status === 404) {
        return new ApiError(
          `404 Not Found. The endpoint does not exist on the server.`,
          'NOT_FOUND'
        );
      }
      return new ApiError(
        `Server error (${response.status}: ${response.statusText})`,
        'HTTP_ERROR'
      );
    }
  } catch {
    return new ApiError(
      `Network error (${response.status}: ${response.statusText})`,
      'NETWORK_ERROR'
    );
  }
}

// Helper to detect DEMO_DATA_NOT_LOADED error
export function isDemoDataNotLoaded(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'DEMO_DATA_NOT_LOADED';
}

// Types
export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  tenureMonths: number;
  performanceScore: number;
  promotionsCount: number;
  lastRoleChangeMonths: number;
  salaryBand: 'low' | 'medium' | 'high';
}

export interface MatchResult {
  candidateId: string;
  name: string;
  role: string;
  skills: string[];
  matchScore: number;
  matchedSkills: string[];
}

export interface MatchResponse {
  query: string;
  results: MatchResult[];
}

export interface RetentionRisk {
  employeeId: string;
  name: string;
  role: string;
  riskScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  reasons: string[];
  recommendedActions: string[];
}

export interface DemoLoadResponse {
  ok: boolean;
  counts: {
    employees: number;
    candidates: number;
    jobs: number;
    programs?: number;
  };
}

export interface DemoStatus {
  loaded: boolean;
  counts: {
    employees: number;
    candidates: number;
    jobs: number;
    programs?: number;
  } | null;
}

// API Functions
export async function loadDemo(): Promise<DemoLoadResponse> {
  const response = await fetch(`${API_URL}/demo/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to load demo data');
  }
  
  return response.json();
}

export async function getDemoStatus(): Promise<DemoStatus> {
  const response = await fetch(`${API_URL}/demo/status`);
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to get demo status');
  }
  
  return response.json();
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_URL}/employees`);
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to fetch employees');
  }
  
  return response.json();
}

export async function matchCandidates(query: string): Promise<MatchResponse> {
  const response = await fetch(
    `${API_URL}/match?query=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to match candidates');
  }
  
  return response.json();
}

export async function getRetention(employeeId: string): Promise<RetentionRisk> {
  const response = await fetch(`${API_URL}/retention/${employeeId}`);
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to fetch retention data');
  }
  
  return response.json();
}

export async function getAllRetention(): Promise<RetentionRisk[]> {
  const response = await fetch(`${API_URL}/retention`);
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to fetch retention data');
  }
  
  return response.json();
}

// Scenario 1: Capability Gap Types
export interface CapabilityGapInput {
  skill: string;
  gapCount: number;
  urgency: 'immediate' | '1-3m' | '3-6m';
  internalAvailability: 'low' | 'medium' | 'high';
  budget: 'low' | 'medium' | 'high';
}

export interface OptionScore {
  option: string;
  score: number;
  pros: string[];
  cons: string[];
  estimatedTimelineWeeks: number;
}

export interface CapabilityGapResult {
  recommendedOption: string;
  confidence: number;
  reasons: string[];
  optionScores: OptionScore[];
  nextSteps: string[];
}

// Scenario 2: Expectation Balance Types
export interface ExpectationBalanceInput {
  candidateLevel: 'junior' | 'mid' | 'senior';
  compExpectation: 'low' | 'medium' | 'high';
  promotionExpectation: 'fast' | 'normal';
  roleCriticality: 'low' | 'medium' | 'high';
  orgStabilityNeed: 'low' | 'medium' | 'high';
}

export interface OfferGuidance {
  compBand: 'low' | 'medium' | 'high';
  equityOrBonus: 'none' | 'small' | 'strong';
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

// Scenario 1: Evaluate Capability Gap
export async function evaluateCapabilityGap(input: CapabilityGapInput): Promise<CapabilityGapResult> {
  const response = await fetch(`${API_URL}/scenario/capability-gap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to evaluate capability gap');
  }
  
  return response.json();
}

// Scenario 2: Evaluate Expectation Balance
export async function evaluateExpectationBalance(input: ExpectationBalanceInput): Promise<ExpectationBalanceResult> {
  const response = await fetch(`${API_URL}/scenario/expectation-balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to evaluate expectation balance');
  }
  
  return response.json();
}

// Scenario 3: Early Risk Types
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

export interface EarlyRiskListResponse {
  results: EarlyRiskSummary[];
}

// Scenario 4: Allocation Types
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

// Scenario 3: Get Early Risk List
export async function getEarlyRiskList(): Promise<EarlyRiskListResponse> {
  const response = await fetch(`${API_URL}/scenario/early-risk`);
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to fetch early risk list');
  }
  
  return response.json();
}

// Scenario 3: Get Early Risk Detail
export async function getEarlyRiskDetail(employeeId: string): Promise<EarlyRiskResult> {
  const response = await fetch(`${API_URL}/scenario/early-risk/${employeeId}`);
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to fetch early risk detail');
  }
  
  return response.json();
}

// Scenario 4: Evaluate Allocation
export async function evaluateAllocation(input: AllocationInput): Promise<AllocationResult> {
  const response = await fetch(`${API_URL}/scenario/allocation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    throw await parseError(response, 'Failed to evaluate allocation');
  }
  
  return response.json();
}
