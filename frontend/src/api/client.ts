const API_BASE = 'http://localhost:4000';

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
    throw new Error(error.message || 'Failed to fetch employees');
  }
  
  return response.json();
}

export async function matchCandidates(query: string): Promise<MatchResponse> {
  const response = await fetch(
    `${API_BASE}/match?query=${encodeURIComponent(query)}`
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to match candidates');
  }
  
  return response.json();
}

export async function getRetention(employeeId: string): Promise<RetentionRisk> {
  const response = await fetch(`${API_BASE}/retention/${employeeId}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch retention data');
  }
  
  return response.json();
}

export async function getAllRetention(): Promise<RetentionRisk[]> {
  const response = await fetch(`${API_BASE}/retention`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch retention data');
  }
  
  return response.json();
}
