# Advanced Digital Talent Acquisition and Retention Experience

A hackathon prototype demonstrating intelligent candidate matching, employee retention risk analysis, capability gap sourcing decisions, and expectation balancing.

## 🎯 Features

- **Skill-Based Candidate Matching**: Search candidates by skills with transparent scoring
- **Retention Risk Analysis**: Rule-based employee retention risk scoring with actionable recommendations
- **Capability Gap Analysis (Scenario 1)**: Decide whether to hire externally, upskill internally, redesign roles, or use contractors
- **Expectation Balance (Scenario 2)**: Balance candidate expectations with organizational sustainability
- **Demo Data**: Pre-loaded sample data for quick demonstration

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+

## 🚀 Quick Start

### 1. Start Backend (Terminal 1)

```bash
cd backend
npm install
npm run dev
```

Backend runs at: http://localhost:4000

### 2. Start Frontend (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

## 🎮 Demo Steps for Judging

### Step 1: Load Demo Data
1. Open http://localhost:5173
2. Click **"Load Demo Data"** button
3. Verify counts appear (10 employees, 10 candidates, 5 jobs)

### Step 2: Test Candidate Matching
1. Click **"Match"** in navigation
2. Enter skills: `react, typescript, node`
3. Click **Search**
4. View ranked candidates with match scores and matched skills highlighted

### Step 3: Test Retention Risk Analysis
1. Click **"Retention"** in navigation
2. View list of employees
3. Click on any employee card
4. View their risk score, risk level, reasons, and recommended actions

### Step 4: Scenario 1 - Capability Gap Analysis
1. Click **"Capability Gap"** in navigation
2. Use default values or adjust:
   - Skill: "GenAI / LLM Engineering"
   - Gap Count: 5
   - Urgency: 1-3 months
   - Internal Availability: Medium
   - Budget: Medium
3. Click **"Analyze Gap"**
4. View:
   - **Recommended option** (highlighted with confidence %)
   - **Reasons** explaining why this option was selected
   - **Option comparison table** with scores, pros/cons, timelines
   - **Next steps** action list

### Step 5: Scenario 2 - Expectation Balance
1. Click **"Expectation Balance"** in navigation
2. Use default values or adjust:
   - Candidate Level: Mid
   - Compensation Expectation: High
   - Promotion Expectation: Fast
   - Role Criticality: High
   - Org Stability Need: High
3. Click **"Evaluate Balance"**
4. View:
   - **Recommended strategy** label
   - **Offer guidance** (comp band, equity/bonus, growth path, impact plan)
   - **Risk flags** (potential issues)
   - **Retention levers** (actions to keep them long-term)

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/demo/load` | Load demo data into memory |
| GET | `/employees` | Get all employees |
| GET | `/match?query=...` | Match candidates by skills |
| GET | `/retention/:employeeId` | Get retention risk for employee |
| POST | `/scenario/capability-gap` | Scenario 1: Evaluate capability gap |
| POST | `/scenario/expectation-balance` | Scenario 2: Evaluate expectation balance |

### Example curl commands

```bash
# Load demo data
curl -X POST http://localhost:4000/demo/load

# Get employees
curl http://localhost:4000/employees

# Match candidates
curl "http://localhost:4000/match?query=react,typescript"

# Get retention risk
curl http://localhost:4000/retention/e1

# Scenario 1: Capability Gap
curl -X POST http://localhost:4000/scenario/capability-gap \
  -H "Content-Type: application/json" \
  -d '{"skill":"GenAI","gapCount":5,"urgency":"1-3m","internalAvailability":"medium","budget":"medium"}'

# Scenario 2: Expectation Balance
curl -X POST http://localhost:4000/scenario/expectation-balance \
  -H "Content-Type: application/json" \
  -d '{"candidateLevel":"mid","compExpectation":"high","promotionExpectation":"fast","roleCriticality":"high","orgStabilityNeed":"high"}'
```

## 🏗️ Project Structure

```
├── README.md
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts
│       ├── store/memoryStore.ts
│       ├── data/demoData.ts
│       ├── routes/
│       │   ├── demo.ts
│       │   ├── employees.ts
│       │   ├── match.ts
│       │   ├── retention.ts
│       │   ├── capability.ts      ← Scenario 1
│       │   └── expectations.ts    ← Scenario 2
│       └── utils/
│           ├── normalize.ts
│           ├── skillMatch.ts
│           ├── retentionScore.ts
│           ├── capabilityDecision.ts   ← Scenario 1 logic
│           └── expectationDecision.ts  ← Scenario 2 logic
└── frontend/
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    └── src/
        ├── main.tsx
        ├── App.tsx
        ├── api/client.ts
        ├── pages/
        │   ├── Dashboard.tsx
        │   ├── Match.tsx
        │   ├── Retention.tsx
        │   ├── CapabilityGap.tsx        ← Scenario 1
        │   └── ExpectationBalance.tsx   ← Scenario 2
        ├── components/
        │   ├── CandidateCard.tsx
        │   ├── EmployeeCard.tsx
        │   ├── RiskCard.tsx
        │   ├── OptionScoresTable.tsx    ← Scenario 1 table
        │   └── ResultCard.tsx           ← Reusable
        └── styles.css
```

## 🔮 Future Upgrades

- **Embeddings-based Matching**: Use vector embeddings (OpenAI, sentence-transformers) for semantic skill matching
- **Resume Parsing**: Integrate resume parsing APIs to extract skills automatically
- **ML Attrition Prediction**: Train classification model on historical attrition data
- **Real Database**: Migrate to PostgreSQL or MongoDB for persistence
- **Authentication**: Add user authentication and role-based access
- **Analytics Dashboard**: Add charts and trends for workforce analytics
- **Interview Scheduling**: Integrate with calendar APIs for interview coordination
- **Offer Letter Generation**: Auto-generate offer letters based on expectation balance results

## 📝 Technical Notes

- **Matching Algorithm**: Simple skill overlap with percentage scoring (matchedSkills / querySkills * 100)
- **Retention Scoring**: Rule-based scoring with cumulative risk factors (capped at 100)
- **Capability Gap Scoring**: Multi-factor scoring across urgency, availability, budget, and gap size
- **Expectation Balance**: Rule-based strategy generation with offer guidance and risk flags
- **Storage**: In-memory singleton store (resets on server restart)

---

Built for Hackathon 2026 🚀
