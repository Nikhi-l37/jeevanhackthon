import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { matchCandidates } from '../utils/skillMatch';
import { Candidate } from '../store/memoryStore';
import { demoCandidates } from '../data/demoData';

const router = Router();

/**
 * GET /match?query=react,typescript
 * Match candidates against a skill query
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== 'string' || query.trim() === '') {
      res.status(400).json({
        error: 'Validation failed',
        message: 'Query parameter is required',
      });
      return;
    }

    let candidates: any[] = [];
    try {
      candidates = await prisma.candidate.findMany();
    } catch {
      candidates = demoCandidates;
    }

    if (!candidates || candidates.length === 0) {
      candidates = demoCandidates;
    }

    const results = matchCandidates(query, candidates as unknown as Candidate[]);

    res.json({
      query: query.trim(),
      results,
    });
  } catch (error) {
    console.error('Error matching candidates:', error);
    const queryStr = (req.query.query as string) || '';
    const results = matchCandidates(queryStr, demoCandidates);
    res.json({ query: queryStr, results });
  }
});

export default router;
