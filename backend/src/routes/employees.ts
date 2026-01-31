import { Router, Request, Response } from 'express';
import { getStore, isLoaded } from '../store/memoryStore';

const router = Router();

/**
 * GET /employees
 * Returns list of all employees
 */
router.get('/', (_req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
    });
    return;
  }

  const store = getStore();
  
  // Return employees with all fields needed for display and retention analysis
  const employees = store.employees.map((emp) => ({
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

  res.json(employees);
});

/**
 * GET /employees/:id
 * Returns single employee by ID
 */
router.get('/:id', (req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
    });
    return;
  }

  const store = getStore();
  const employee = store.employees.find((e) => e.id === req.params.id);

  if (!employee) {
    res.status(404).json({
      error: 'Employee not found',
      message: `No employee found with ID: ${req.params.id}`,
    });
    return;
  }

  res.json(employee);
});

export default router;
