/**
 * Scenario 3: Early Risk Detection Routes
 * GET /scenario/early-risk - List all employees with risk scores
 * GET /scenario/early-risk/:employeeId - Get detailed risk analysis
 */

import { Router, Request, Response } from 'express';
import { getStore, isLoaded } from '../store/memoryStore';
import { computeEarlyRisk, getEarlyRiskList } from '../utils/earlyRisk';

const router = Router();

/**
 * GET /scenario/early-risk
 * Returns list of all employees sorted by early risk score (desc)
 */
router.get('/early-risk', (_req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
    });
    return;
  }

  const store = getStore();
  const results = getEarlyRiskList(store.employees);

  res.json({ results });
});

/**
 * GET /scenario/early-risk/:employeeId
 * Returns detailed early risk analysis for a specific employee
 */
router.get('/early-risk/:employeeId', (req: Request, res: Response) => {
  if (!isLoaded()) {
    res.status(400).json({
      ok: false,
      error: 'DEMO_DATA_NOT_LOADED',
      message: 'Demo data not loaded',
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

  const result = computeEarlyRisk(employee);
  res.json(result);
});

export default router;
