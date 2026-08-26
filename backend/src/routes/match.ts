import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { matchCandidates } from '../utils/skillMatch';

const router = Router();

/**
 * GET /match?query=...
 * Match candidates by skills query from Supabase database
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const candidateCount = await prisma.candidate.count();
    if (candidateCount === 0) {
      res.status(400).json({
        ok: false,
        error: 'DEMO_DATA_NOT_LOADED',
        message: 'Demo data not loaded. Please load demo data first.',
      });
      return;
    }

    const query = req.query.query as string;

    if (!query || query.trim() === '') {
      res.status(400).json({
        error: 'Missing query parameter',
        message: 'Please provide a query parameter with skills to search, e.g., ?query=react,typescript',
      });
      return;
    }

    const candidates = await prisma.candidate.findMany();
    const results = matchCandidates(query, candidates, 10);

    res.json({
      query: query.trim(),
      results,
    });
  } catch (error) {
    console.error('Error matching candidates:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to match candidates from database',
    });
  }
});

export default router;
