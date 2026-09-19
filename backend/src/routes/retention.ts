import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { computeRetentionRisk } from '../utils/retentionScore';
import { Employee } from '../store/memoryStore';
import { demoEmployees } from '../data/demoData';

const router = Router();

/**
 * GET /retention
 * Returns retention risk analysis for all employees
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    let employees: any[] = [];
    try {
      employees = await prisma.employee.findMany();
    } catch {
      employees = demoEmployees;
    }

    if (!employees || employees.length === 0) {
      employees = demoEmployees;
    }

    const results = employees.map((emp) =>
      computeRetentionRisk(emp as unknown as Employee)
    );

    res.json(results);
  } catch (error) {
    console.error('Error fetching all retention risk:', error);
    const results = demoEmployees.map((emp) => computeRetentionRisk(emp));
    res.json(results);
  }
});

/**
 * GET /retention/:employeeId
 * Returns retention risk analysis for a specific employee
 */
router.get('/:employeeId', async (req: Request, res: Response) => {
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

    const result = computeRetentionRisk(employee as unknown as Employee);
    res.json(result);
  } catch (error) {
    console.error('Error fetching retention risk for employee:', error);
    const employee = demoEmployees.find((e) => e.id === req.params.employeeId) || demoEmployees[0];
    const result = computeRetentionRisk(employee);
    res.json(result);
  }
});

export default router;
