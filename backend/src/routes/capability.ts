import { Router, Request, Response } from 'express';
import { evaluateCapabilityGap, CapabilityGapInput } from '../utils/capabilityDecision';

const router = Router();

/**
 * POST /scenario/capability-gap
 * Evaluate capability gap and recommend sourcing strategy
 */
router.post('/capability-gap', (req: Request, res: Response) => {
  const { skill, gapCount, urgency, internalAvailability, budget } = req.body;

  // Validate required fields
  const errors: string[] = [];

  if (!skill || typeof skill !== 'string' || skill.trim() === '') {
    errors.push('skill is required and must be a non-empty string');
  }

  if (gapCount === undefined || typeof gapCount !== 'number' || gapCount < 1 || gapCount > 50) {
    errors.push('gapCount is required and must be a number between 1 and 50');
  }

  const validUrgencies = ['immediate', '1-3m', '3-6m'];
  if (!urgency || !validUrgencies.includes(urgency)) {
    errors.push(`urgency is required and must be one of: ${validUrgencies.join(', ')}`);
  }

  const validAvailabilities = ['low', 'medium', 'high'];
  if (!internalAvailability || !validAvailabilities.includes(internalAvailability)) {
    errors.push(`internalAvailability is required and must be one of: ${validAvailabilities.join(', ')}`);
  }

  const validBudgets = ['low', 'medium', 'high'];
  if (!budget || !validBudgets.includes(budget)) {
    errors.push(`budget is required and must be one of: ${validBudgets.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
    return;
  }

  const input: CapabilityGapInput = {
    skill: skill.trim(),
    gapCount,
    urgency,
    internalAvailability,
    budget,
  };

  try {
    const result = evaluateCapabilityGap(input);
    res.json(result);
  } catch (error) {
    console.error('Error evaluating capability gap:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to evaluate capability gap',
    });
  }
});

export default router;
