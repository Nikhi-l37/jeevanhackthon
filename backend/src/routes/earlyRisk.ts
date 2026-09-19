/**
 * Scenario 3: Early Risk Detection Routes
 * GET /scenario/early-risk - List all employees with risk scores
 * GET /scenario/early-risk/:employeeId - Get detailed risk analysis
 */

import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { computeEarlyRisk, getEarlyRiskList } from '../utils/earlyRisk';
import { Employee } from '../store/memoryStore';
import { demoEmployees } from '../data/demoData';

const router = Router();

/**
 * GET /scenario/early-risk
 * Returns list of all employees sorted by early risk score (desc)
 */
router.get('/early-risk', async (_req: Request, res: Response) => {
  try {
    let employees: any[] = [];
    try {
      employees = await prisma.employee.findMany();
    } catch (dbErr) {
      console.warn('Database query failed, using built-in data:', (dbErr as Error)?.message);
      employees = demoEmployees;
    }

    if (!employees || employees.length === 0) {
      employees = demoEmployees;
    }

    const results = getEarlyRiskList(employees as unknown as Employee[]);
    res.json({ results });
  } catch (error) {
    console.error('Error fetching early risk list:', error);
    const results = getEarlyRiskList(demoEmployees);
    res.json({ results });
  }
});

/**
 * GET /scenario/early-risk/:employeeId
 * Returns detailed early risk analysis for a specific employee
 */
router.get('/early-risk/:employeeId', async (req: Request, res: Response) => {
  try {
    const { employeeId } = req.params;
    let employee: any = null;
    try {
      employee = await prisma.employee.findUnique({
        where: { id: employeeId },
      });
    } catch {
      employee = demoEmployees.find((e) => e.id === employeeId);
    }

    if (!employee) {
      employee = demoEmployees.find((e) => e.id === employeeId);
    }

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
    const employee = demoEmployees.find((e) => e.id === req.params.employeeId) || demoEmployees[0];
    const result = computeEarlyRisk(employee);
    res.json(result);
  }
});

export default router;
