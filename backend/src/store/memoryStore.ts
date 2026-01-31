// In-memory singleton store for hackathon prototype

export interface Employee {
  id: string;
  name: string;
  role: string;
  skills: string[];
  tenureMonths: number;
  performanceScore: number; // 1.0 - 5.0
  promotionsCount: number;
  lastRoleChangeMonths: number;
  salaryBand: 'low' | 'medium' | 'high';
  // Scenario 3: Early Risk fields
  recentWorkloadLevel: 'low' | 'medium' | 'high';
  overtimeHoursLast4Weeks: number;
  engagementScore: number; // 1.0 - 5.0
  managerCheckinsLastMonth: number;
  ptoDaysTakenLast90Days: number;
  projectCriticality: 'low' | 'medium' | 'high';
  projectEndInDays: number; // negative if just ended
  recognitionLast60Days: 'low' | 'medium' | 'high';
  internalMobilityInterest: 'low' | 'medium' | 'high';
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  skills: string[];
  experienceYears: number;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  requiredSkills: string[];
  level: 'junior' | 'mid' | 'senior';
}

// Scenario 4: Program/Initiative for allocation
export interface Program {
  id: string;
  name: string;
  department: string;
  requiredSkills: string[];
  urgency: 'low' | 'medium' | 'high';
  businessImpact: 'low' | 'medium' | 'high';
  headcountNeeded: number;
  deadlineInWeeks: number;
}

export interface Store {
  employees: Employee[];
  candidates: Candidate[];
  jobs: Job[];
  programs: Program[];
  loaded: boolean;
}

// Singleton store instance
const store: Store = {
  employees: [],
  candidates: [],
  jobs: [],
  programs: [],
  loaded: false,
};

export function getStore(): Store {
  return store;
}

export function loadData(
  employees: Employee[],
  candidates: Candidate[],
  jobs: Job[],
  programs: Program[]
): void {
  store.employees = employees;
  store.candidates = candidates;
  store.jobs = jobs;
  store.programs = programs;
  store.loaded = true;
}

export function isLoaded(): boolean {
  return store.loaded;
}

export function resetStore(): void {
  store.employees = [];
  store.candidates = [];
  store.jobs = [];
  store.programs = [];
  store.loaded = false;
}
