import { Router, Request, Response } from 'express';
import { getStore, isLoaded } from '../store/memoryStore';
import { matchCandidates } from '../utils/skillMatch';

const router = Router();

/**
 * GET /match?query=...
 * Match candidates by skills query
 */
router.get('/', (req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
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

  const store = getStore();
  const results = matchCandidates(query, store.candidates, 10);

  res.json({
    query: query.trim(),
    results,
  });
});

export default router;
