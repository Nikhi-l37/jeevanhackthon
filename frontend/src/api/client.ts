// Use relative URL in production, localhost in development
const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:4000';

// Custom error class for API errors
export class ApiError extends Error {
  code: string;
  
  constructor(message: string, code: string = 'UNKNOWN_ERROR') {
    super(message);
    this.code = code;
    this.name = 'ApiError';
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
  };
}

export interface DemoStatus {
  loaded: boolean;
  counts: {
    employees: number;
    candidates: number;
    jobs: number;
  } | null;
}

// API Functions
export async function loadDemo(): Promise<DemoLoadResponse> {
  const response = await fetch(`${API_BASE}/demo/load`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to load demo data');
  }
  
  return response.json();
}

export async function getDemoStatus(): Promise<DemoStatus> {
  const response = await fetch(`${API_BASE}/demo/status`);
  
  if (!response.ok) {
    throw new Error('Failed to get demo status');
  }
  
  return response.json();
}

export async function getEmployees(): Promise<Employee[]> {
  const response = await fetch(`${API_BASE}/employees`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Failed to fetch employees', error.error || 'UNKNOWN_ERROR');
  }
  
  return response.json();
}

export async function matchCandidates(query: string): Promise<MatchResponse> {
  const response = await fetch(
    `${API_BASE}/match?query=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Failed to match candidates', error.error || 'UNKNOWN_ERROR');
  }
  
  return response.json();
}

export async function getRetention(employeeId: string): Promise<RetentionRisk> {
  const response = await fetch(`${API_BASE}/retention/${employeeId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Failed to fetch retention data', error.error || 'UNKNOWN_ERROR');
  }
  
  return response.json();
}

export async function getAllRetention(): Promise<RetentionRisk[]> {
  const response = await fetch(`${API_BASE}/retention`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new ApiError(error.message || 'Failed to fetch retention data', error.error || 'UNKNOWN_ERROR');
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
  const response = await fetch(`${API_BASE}/scenario/capability-gap`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.messages?.join(', ') || error.message || 'Failed to evaluate capability gap');
  }
  
  return response.json();
}

// Scenario 2: Evaluate Expectation Balance
export async function evaluateExpectationBalance(input: ExpectationBalanceInput): Promise<ExpectationBalanceResult> {
  const response = await fetch(`${API_BASE}/scenario/expectation-balance`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.messages?.join(', ') || error.message || 'Failed to evaluate expectation balance');
  }
  
  return response.json();
}
