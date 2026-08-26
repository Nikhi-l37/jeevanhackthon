/**
 * Scenario 4: Talent Allocation Routes
 * POST /scenario/allocation - Allocate scarce skills across programs
 */

import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { computeAllocation, AllocationInput } from '../utils/allocation';
import { Program } from '../store/memoryStore';

const router = Router();

/**
 * POST /scenario/allocation
 * Allocate scarce talent across competing programs
 */
router.post('/allocation', async (req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany();

    if (programs.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'DEMO_DATA_NOT_LOADED',
        message: 'Demo data not loaded. Please click "Load Demo" to initialize data.',
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

    const result = computeAllocation(
      { scarceSkill: scarceSkill!.trim(), availablePeople: availablePeople! },
      programs as unknown as Program[]
    );

    res.json(result);
  } catch (error) {
    console.error('Error computing allocation:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to compute allocation',
    });
  }
});

/**
 * GET /scenario/programs
 * List all programs (for UI convenience)
 */
router.get('/programs', async (_req: Request, res: Response) => {
  try {
    const programs = await prisma.program.findMany();

    if (programs.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'DEMO_DATA_NOT_LOADED',
        message: 'Demo data not loaded. Please click "Load Demo" to initialize data.',
      });
      return;
    }

    res.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to fetch programs from database',
    });
  }
});

export default router;
