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

export interface Store {
  employees: Employee[];
  candidates: Candidate[];
  jobs: Job[];
  loaded: boolean;
}

// Singleton store instance
const store: Store = {
  employees: [],
  candidates: [],
  jobs: [],
  loaded: false,
};

export function getStore(): Store {
  return store;
}

export function loadData(
  employees: Employee[],
  candidates: Candidate[],
  jobs: Job[]
): void {
  store.employees = employees;
  store.candidates = candidates;
  store.jobs = jobs;
  store.loaded = true;
}

export function isLoaded(): boolean {
  return store.loaded;
}

export function resetStore(): void {
  store.employees = [];
  store.candidates = [];
  store.jobs = [];
  store.loaded = false;
}
