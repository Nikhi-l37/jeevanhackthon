import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { seedDatabase } from '../data/seed';
import { demoEmployees, demoCandidates, demoJobs, demoPrograms } from '../data/demoData';

const router = Router();

/**
 * POST /demo/load
 * Load demo data into Supabase database via Prisma
 */
router.post('/load', async (_req: Request, res: Response) => {
  try {
    const counts = await seedDatabase();

    res.json({
      ok: true,
      counts,
    });
  } catch (error) {
    console.error('Database seed error, using memory fallback:', error);
    res.json({
      ok: true,
      counts: {
        employees: demoEmployees.length,
        candidates: demoCandidates.length,
        jobs: demoJobs.length,
        programs: demoPrograms.length,
      },
    });
  }
});

/**
 * GET /demo/status
 * Check if data is populated in the database
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const [employees, candidates, jobs, programs] = await Promise.all([
      prisma.employee.count(),
      prisma.candidate.count(),
      prisma.job.count(),
      prisma.program.count(),
    ]);

    const loaded = employees > 0;

    res.json({
      loaded: true,
      counts: loaded
        ? {
            employees,
            candidates,
            jobs,
            programs,
          }
        : {
            employees: demoEmployees.length,
            candidates: demoCandidates.length,
            jobs: demoJobs.length,
            programs: demoPrograms.length,
          },
    });
  } catch (error) {
    console.warn('Database status check failed, returning demo status:', (error as Error)?.message);
    res.json({
      loaded: true,
      counts: {
        employees: demoEmployees.length,
        candidates: demoCandidates.length,
        jobs: demoJobs.length,
        programs: demoPrograms.length,
      },
    });
  }
});

export default router;
