import express from 'express';
import cors from 'cors';
import path from 'path';

import demoRoutes from './routes/demo';
import employeesRoutes from './routes/employees';
import matchRoutes from './routes/match';
import retentionRoutes from './routes/retention';
import capabilityRoutes from './routes/capability';
import expectationsRoutes from './routes/expectations';
import earlyRiskRoutes from './routes/earlyRisk';
import allocationRoutes from './routes/allocation';

const app = express();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(cors({
  origin: isProduction ? true : 'http://localhost:5173',
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
app.use('/scenario', earlyRiskRoutes);
app.use('/scenario', allocationRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve frontend in production
if (isProduction) {
  const publicPath = path.join(__dirname, 'public');
  app.use(express.static(publicPath));
  
  // Serve index.html for all non-API routes (SPA support)
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/demo') || 
        req.path.startsWith('/employees') || 
        req.path.startsWith('/match') || 
        req.path.startsWith('/retention') || 
        req.path.startsWith('/scenario') ||
        req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// Root endpoint (only in development)
if (!isProduction) {
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
        'GET /scenario/early-risk': 'List employees by early risk score',
        'GET /scenario/early-risk/:id': 'Get early risk analysis for employee',
        'POST /scenario/allocation': 'Allocate scarce skills across programs',
        'GET /scenario/programs': 'List all programs',
        'GET /health': 'Health check',
      },
    });
  });
}

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
  GET  /scenario/early-risk           - Scenario 3: Early risk list
  GET  /scenario/early-risk/:id       - Scenario 3: Early risk detail
  POST /scenario/allocation           - Scenario 4: Allocation

Frontend should run at http://localhost:5173
  `);
});
