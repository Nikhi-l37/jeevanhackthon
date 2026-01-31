import { Router, Request, Response } from 'express';
import { getStore, isLoaded } from '../store/memoryStore';
import { computeRetentionRisk } from '../utils/retentionScore';

const router = Router();

/**
 * GET /retention/:employeeId
 * Get retention risk analysis for an employee
 */
router.get('/:employeeId', (req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      error: 'Demo data not loaded',
      message: 'Please call POST /demo/load first to load demo data',
    });
    return;
  }

  const { employeeId } = req.params;
  const store = getStore();
  
  const employee = store.employees.find((e) => e.id === employeeId);

  if (!employee) {
    res.status(404).json({
      error: 'Employee not found',
      message: `No employee found with ID: ${employeeId}`,
    });
    return;
  }

  const riskAnalysis = computeRetentionRisk(employee);
  
  res.json(riskAnalysis);
});

/**
 * GET /retention
 * Get retention risk analysis for all employees
 */
router.get('/', (_req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      error: 'Demo data not loaded',
      message: 'Please call POST /demo/load first to load demo data',
    });
    return;
  }

  const store = getStore();
  
  const results = store.employees.map((employee) => computeRetentionRisk(employee));
  
  // Sort by risk score descending
  results.sort((a, b) => b.riskScore - a.riskScore);

  res.json(results);
});

export default router;
