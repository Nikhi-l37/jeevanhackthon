import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { computeRetentionRisk } from '../utils/retentionScore';
import { Employee } from '../store/memoryStore';

const router = Router();

/**
 * GET /retention/:employeeId
 * Get retention risk analysis for an employee
 */
router.get('/:employeeId', async (req: Request, res: Response) => {
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

    const riskAnalysis = computeRetentionRisk(employee as unknown as Employee);
    res.json(riskAnalysis);
  } catch (error) {
    console.error('Error fetching retention analysis:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to compute retention analysis',
    });
  }
});

/**
 * GET /retention
 * Get retention risk analysis for all employees
 */
router.get('/', async (_req: Request, res: Response) => {
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

    const results = employees.map((employee: any) =>
      computeRetentionRisk(employee as unknown as Employee)
    );

    // Sort by risk score descending
    results.sort((a: any, b: any) => b.riskScore - a.riskScore);

    res.json(results);
  } catch (error) {
    console.error('Error fetching all retention analyses:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to compute retention analyses',
    });
  }
});

export default router;
