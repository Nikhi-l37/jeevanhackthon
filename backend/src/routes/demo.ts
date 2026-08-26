import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { seedDatabase } from '../data/seed';

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
    console.error('Error loading demo data into database:', error);
    res.status(500).json({
      ok: false,
      error: 'Failed to load demo data',
      message: error instanceof Error ? error.message : 'Unknown error',
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
      loaded,
      counts: loaded
        ? {
            employees,
            candidates,
            jobs,
            programs,
          }
        : null,
    });
  } catch (error) {
    console.error('Error fetching database status:', error);
    res.status(500).json({
      loaded: false,
      counts: null,
      error: 'Failed to connect to database',
    });
  }
});

export default router;
