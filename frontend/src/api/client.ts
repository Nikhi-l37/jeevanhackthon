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

// Safe fetch wrapper that handles network failures, HTML responses, and JSON parsing gracefully
async function fetchJson<T>(url: string, options?: RequestInit, defaultErrorMessage = 'Request failed'): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError(
      `Cannot connect to backend server at "${API_URL}". Please ensure your backend server is running.`,
      'NETWORK_ERROR'
    );
  }

  const contentType = response.headers.get('content-type') || '';

  if (!response.ok) {
    throw await parseError(response, defaultErrorMessage);
  }

  if (contentType.includes('text/html')) {
    throw new ApiError(
      `Received HTML instead of JSON from "${url}". Please ensure VITE_API_URL points to your Express backend port (e.g., http://localhost:4000).`,
      'INVALID_CONTENT_TYPE'
    );
  }

  try {
    return await response.json();
  } catch {
    throw new ApiError(
      `Invalid JSON response from server at "${url}".`,
      'INVALID_JSON'
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
  return fetchJson<DemoLoadResponse>(
    `${API_URL}/demo/load`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    'Failed to load demo data'
  );
}

export async function getDemoStatus(): Promise<DemoStatus> {
  return fetchJson<DemoStatus>(
    `${API_URL}/demo/status`,
    undefined,
    'Failed to get demo status'
  );
}

export async function getEmployees(): Promise<Employee[]> {
  return fetchJson<Employee[]>(
    `${API_URL}/employees`,
    undefined,
    'Failed to fetch employees'
  );
}

export async function matchCandidates(query: string): Promise<MatchResponse> {
  return fetchJson<MatchResponse>(
    `${API_URL}/match?query=${encodeURIComponent(query)}`,
    undefined,
    'Failed to match candidates'
  );
}

export async function getRetention(employeeId: string): Promise<RetentionRisk> {
  return fetchJson<RetentionRisk>(
    `${API_URL}/retention/${employeeId}`,
    undefined,
    'Failed to fetch retention data'
  );
}

export async function getAllRetention(): Promise<RetentionRisk[]> {
  return fetchJson<RetentionRisk[]>(
    `${API_URL}/retention`,
    undefined,
    'Failed to fetch retention data'
  );
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
  return fetchJson<CapabilityGapResult>(
    `${API_URL}/scenario/capability-gap`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    'Failed to evaluate capability gap'
  );
}

// Scenario 2: Evaluate Expectation Balance
export async function evaluateExpectationBalance(input: ExpectationBalanceInput): Promise<ExpectationBalanceResult> {
  return fetchJson<ExpectationBalanceResult>(
    `${API_URL}/scenario/expectation-balance`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    'Failed to evaluate expectation balance'
  );
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
  return fetchJson<EarlyRiskListResponse>(
    `${API_URL}/scenario/early-risk`,
    undefined,
    'Failed to fetch early risk list'
  );
}

// Scenario 3: Get Early Risk Detail
export async function getEarlyRiskDetail(employeeId: string): Promise<EarlyRiskResult> {
  return fetchJson<EarlyRiskResult>(
    `${API_URL}/scenario/early-risk/${employeeId}`,
    undefined,
    'Failed to fetch early risk detail'
  );
}

// Scenario 4: Evaluate Allocation
export async function evaluateAllocation(input: AllocationInput): Promise<AllocationResult> {
  return fetchJson<AllocationResult>(
    `${API_URL}/scenario/allocation`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    'Failed to evaluate allocation'
  );
}
