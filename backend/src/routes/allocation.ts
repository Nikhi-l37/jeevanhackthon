/**
 * Scenario 4: Talent Allocation Routes
 * POST /scenario/allocation - Allocate scarce skills across programs
 */

import { Router, Request, Response } from 'express';
import { getStore, isLoaded } from '../store/memoryStore';
import { computeAllocation, AllocationInput } from '../utils/allocation';

const router = Router();

/**
 * POST /scenario/allocation
 * Allocate scarce talent across competing programs
 */
router.post('/allocation', (req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
    });
    return;
  }

  const { scarceSkill, availablePeople } = req.body as Partial<AllocationInput>;

  // Validate input
  const errors: string[] = [];

  if (!scarceSkill || typeof scarceSkill !== 'string' || scarceSkill.trim() === '') {
    errors.push('scarceSkill is required and must be a non-empty string');
  }

  if (availablePeople === undefined || typeof availablePeople !== 'number' || availablePeople < 0) {
    errors.push('availablePeople is required and must be a non-negative number');
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
    return;
  }

  const store = getStore();
  const result = computeAllocation(
    { scarceSkill: scarceSkill!.trim(), availablePeople: availablePeople! },
    store.programs
  );

  res.json(result);
});

/**
 * GET /scenario/programs
 * List all programs (for UI convenience)
 */
router.get('/programs', (_req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
    });
    return;
  }

  const store = getStore();
  res.json({ programs: store.programs });
});

export default router;
