import express from 'express';
import cors from 'cors';

import demoRoutes from './routes/demo';
import employeesRoutes from './routes/employees';
import matchRoutes from './routes/match';
import retentionRoutes from './routes/retention';
import capabilityRoutes from './routes/capability';
import expectationsRoutes from './routes/expectations';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Request logging for development
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/demo', demoRoutes);
app.use('/employees', employeesRoutes);
app.use('/match', matchRoutes);
app.use('/retention', retentionRoutes);
app.use('/scenario', capabilityRoutes);
app.use('/scenario', expectationsRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    name: 'Talent Acquisition & Retention API',
    version: '1.0.0',
    endpoints: {
      'POST /demo/load': 'Load demo data',
      'GET /demo/status': 'Check if demo data is loaded',
      'GET /employees': 'List all employees',
      'GET /employees/:id': 'Get employee by ID',
      'GET /match?query=...': 'Match candidates by skills',
      'GET /retention/:employeeId': 'Get retention risk for employee',
      'GET /retention': 'Get retention risk for all employees',
      'POST /scenario/capability-gap': 'Evaluate capability gap sourcing strategy',
      'POST /scenario/expectation-balance': 'Evaluate candidate expectation balance',
      'GET /health': 'Health check',
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not found',
    message: 'The requested endpoint does not exist',
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 Talent API Server running at http://localhost:${PORT}

Available endpoints:
  POST /demo/load              - Load demo data
  GET  /employees              - List employees
  GET  /match?query=...        - Match candidates
  GET  /retention/:id          - Get retention risk
  POST /scenario/capability-gap       - Scenario 1: Capability gap
  POST /scenario/expectation-balance  - Scenario 2: Expectation balance

Frontend should run at http://localhost:5173
  `);
});
