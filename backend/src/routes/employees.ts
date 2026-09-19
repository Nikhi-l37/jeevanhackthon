import { Router, Request, Response } from 'express';
import prisma from '../db/prisma';
import { demoEmployees } from '../data/demoData';

const router = Router();

/**
 * GET /employees
 * Returns list of all employees
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    let employees: any[] = [];
    try {
      employees = await prisma.employee.findMany({
        orderBy: { id: 'asc' },
      });
    } catch {
      employees = demoEmployees;
    }

    if (!employees || employees.length === 0) {
      employees = demoEmployees;
    }

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
    res.json(demoEmployees);
  }
});

/**
 * GET /employees/:id
 * Returns single employee by ID
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    let employee: any = null;
    try {
      employee = await prisma.employee.findUnique({
        where: { id: req.params.id },
      });
    } catch {
      employee = demoEmployees.find((e) => e.id === req.params.id);
    }

    if (!employee) {
      employee = demoEmployees.find((e) => e.id === req.params.id);
    }

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
    const employee = demoEmployees.find((e) => e.id === req.params.id) || demoEmployees[0];
    res.json(employee);
  }
});

export default router;
