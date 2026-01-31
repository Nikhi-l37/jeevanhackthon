import { Router, Request, Response } from 'express';
import { loadData, getStore } from '../store/memoryStore';
import { demoEmployees, demoCandidates, demoJobs, demoPrograms } from '../data/demoData';

const router = Router();

/**
 * POST /demo/load
 * Load demo data into memory store
 */
router.post('/load', (_req: Request, res: Response) => {
  try {
    loadData(demoEmployees, demoCandidates, demoJobs, demoPrograms);
    
    const store = getStore();
    
    res.json({
      ok: true,
      counts: {
        employees: store.employees.length,
        candidates: store.candidates.length,
        jobs: store.jobs.length,
        programs: store.programs.length,
      },
    });
  } catch (error) {
    console.error('Error loading demo data:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to load demo data',
    });
  }
});

/**
 * GET /demo/status
 * Check if demo data is loaded
 */
router.get('/status', (_req: Request, res: Response) => {
  const store = getStore();
  
  res.json({
    loaded: store.loaded,
    counts: store.loaded
      ? {
          employees: store.employees.length,
          candidates: store.candidates.length,
          jobs: store.jobs.length,
          programs: store.programs.length,
        }
      : null,
  });
});

export default router;
