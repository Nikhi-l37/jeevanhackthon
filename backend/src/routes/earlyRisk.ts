/**
 * Scenario 3: Early Risk Detection Routes
 * GET /scenario/early-risk - List all employees with risk scores
 * GET /scenario/early-risk/:employeeId - Get detailed risk analysis
 */

import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { computeEarlyRisk, getEarlyRiskList } from '../utils/earlyRisk';
import { Employee } from '../store/memoryStore';

const router = Router();

/**
 * GET /scenario/early-risk
 * Returns list of all employees sorted by early risk score (desc)
 */
router.get('/early-risk', async (_req: Request, res: Response) => {
  try {
    const employees = await prisma.employee.findMany();

    if (employees.length === 0) {
      res.status(400).json({
        ok: false,
        error: 'DEMO_DATA_NOT_LOADED',
        message: 'Demo data not loaded. Please click "Load Demo" to initialize data.',
      });
      return;
    }

    const results = getEarlyRiskList(employees as unknown as Employee[]);
    res.json({ results });
  } catch (error) {
    console.error('Error fetching early risk list:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to fetch early risk list from database',
    });
  }
});

/**
 * GET /scenario/early-risk/:employeeId
 * Returns detailed early risk analysis for a specific employee
 */
router.get('/early-risk/:employeeId', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      res.status(404).json({
        error: 'Employee not found',
        message: `No employee found with ID: ${employeeId}`,
      });
      return;
    }

    const result = computeEarlyRisk(employee as unknown as Employee);
    res.json(result);
  } catch (error) {
    console.error('Error fetching early risk detail:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to compute early risk analysis',
    });
  }
});

export default router;
