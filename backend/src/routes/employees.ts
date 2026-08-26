import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';

const router = Router();

/**
 * GET /employees
 * Returns list of all employees
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    const totalCount = await prisma.employee.count();
    if (totalCount === 0) {
      res.status(400).json({
        ok: false,
        error: 'DEMO_DATA_NOT_LOADED',
        message: 'Demo data not loaded. Please click "Load Demo" to initialize data.',
      });
      return;
    }

    const employees = await prisma.employee.findMany({
      orderBy: { id: 'asc' },
    });

    const formattedEmployees = employees.map((emp: any) => ({
      id: emp.id,
      name: emp.name,
      role: emp.role,
      skills: emp.skills,
      tenureMonths: emp.tenureMonths,
      performanceScore: emp.performanceScore,
      promotionsCount: emp.promotionsCount,
      lastRoleChangeMonths: emp.lastRoleChangeMonths,
      salaryBand: emp.salaryBand,
    }));

    res.json(formattedEmployees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to fetch employees from database',
    });
  }
});

/**
 * GET /employees/:id
 * Returns single employee by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.params.id },
    });

    if (!employee) {
      res.status(404).json({
        error: 'Employee not found',
        message: `No employee found with ID: ${req.params.id}`,
      });
      return;
    }

    res.json(employee);
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({
      error: 'DATABASE_ERROR',
      message: 'Failed to fetch employee from database',
    });
  }
});

export default router;
