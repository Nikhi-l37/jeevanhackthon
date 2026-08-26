import { Router, Request, Response } from 'express';
import { evaluateExpectationBalance, ExpectationBalanceInput } from '../utils/expectationDecision';
import prisma from '../db/prisma';

const router = Router();

/**
 * POST /scenario/expectation-balance
 * Evaluate candidate expectations vs organizational sustainability
 */
router.post('/expectation-balance', async (req: Request, res: Response) => {
  const { candidateLevel, compExpectation, promotionExpectation, roleCriticality, orgStabilityNeed } = req.body;

  // Validate required fields
  const errors: string[] = [];

  const validLevels = ['junior', 'mid', 'senior'];
  if (!candidateLevel || !validLevels.includes(candidateLevel)) {
    errors.push(`candidateLevel is required and must be one of: ${validLevels.join(', ')}`);
  }

  const validExpectations = ['low', 'medium', 'high'];
  if (!compExpectation || !validExpectations.includes(compExpectation)) {
    errors.push(`compExpectation is required and must be one of: ${validExpectations.join(', ')}`);
  }

  const validPromotions = ['fast', 'normal'];
  if (!promotionExpectation || !validPromotions.includes(promotionExpectation)) {
    errors.push(`promotionExpectation is required and must be one of: ${validPromotions.join(', ')}`);
  }

  if (!roleCriticality || !validExpectations.includes(roleCriticality)) {
    errors.push(`roleCriticality is required and must be one of: ${validExpectations.join(', ')}`);
  }

  if (!orgStabilityNeed || !validExpectations.includes(orgStabilityNeed)) {
    errors.push(`orgStabilityNeed is required and must be one of: ${validExpectations.join(', ')}`);
  }

  if (errors.length > 0) {
    res.status(400).json({
      error: 'Validation failed',
      messages: errors,
    });
    return;
  }

  const input: ExpectationBalanceInput = {
    candidateLevel,
    compExpectation,
    promotionExpectation,
    roleCriticality,
    orgStabilityNeed,
  };

  try {
    const result = evaluateExpectationBalance(input);

    // Asynchronously log scenario evaluation to database
    prisma.scenarioLog
      .create({
        data: {
          scenarioType: 'expectation-balance',
          inputData: JSON.stringify(input),
          resultData: JSON.stringify(result),
        },
      })
      .catch((err: any) => console.warn('Could not log scenario to database:', err?.message));

    res.json(result);
  } catch (error) {
    console.error('Error evaluating expectation balance:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to evaluate expectation balance',
    });
  }
});

export default router;
