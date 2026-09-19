/**
 * Scenario 4: Talent Allocation Routes
 * POST /scenario/allocation - Allocate scarce skills across programs
 */

import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { computeAllocation, AllocationInput } from '../utils/allocation';
import { Program } from '../store/memoryStore';
import { demoPrograms } from '../data/demoData';

const router = Router();

/**
 * POST /scenario/allocation
 * Allocate scarce talent across competing programs
 */
router.post('/allocation', async (req: Request, res: Response) => {
  try {
    let programs: any[] = [];
    try {
      programs = await prisma.program.findMany();
    } catch (dbErr) {
      console.warn('Database query failed, using built-in programs:', (dbErr as Error)?.message);
      programs = demoPrograms;
    }

    if (!programs || programs.length === 0) {
      programs = demoPrograms;
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
    let programs: any[] = [];
    try {
      programs = await prisma.program.findMany();
    } catch {
      programs = demoPrograms;
    }

    if (!programs || programs.length === 0) {
      programs = demoPrograms;
    }

    res.json({ programs });
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.json({ programs: demoPrograms });
  }
});

export default router;
