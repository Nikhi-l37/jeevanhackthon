# Advanced Digital Talent Acquisition and Retention Experience

A hackathon prototype demonstrating intelligent candidate matching and employee retention risk analysis.

## 🎯 Features

- **Skill-Based Candidate Matching**: Search candidates by skills with transparent scoring
- **Retention Risk Analysis**: Rule-based employee retention risk scoring with actionable recommendations
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
1. Click **"Match Candidates"** link
2. Enter skills: `react, typescript, node`
3. Click **Search**
4. View ranked candidates with match scores and matched skills highlighted

### Step 3: Test Retention Risk Analysis
1. Click **"Retention Analysis"** link
2. View list of employees
3. Click on any employee card
4. View their risk score, risk level, reasons, and recommended actions

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/demo/load` | Load demo data into memory |
| GET | `/employees` | Get all employees |
| GET | `/match?query=...` | Match candidates by skills |
| GET | `/retention/:employeeId` | Get retention risk for employee |

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
│       ├── routes/demo.ts
│       ├── routes/employees.ts
│       ├── routes/match.ts
│       ├── routes/retention.ts
│       └── utils/
│           ├── normalize.ts
│           ├── skillMatch.ts
│           └── retentionScore.ts
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
        │   └── Retention.tsx
        ├── components/
        │   ├── CandidateCard.tsx
        │   ├── EmployeeCard.tsx
        │   └── RiskCard.tsx
        └── styles.css
```

## 🔮 Future Upgrades

- **Embeddings-based Matching**: Use vector embeddings (OpenAI, sentence-transformers) for semantic skill matching
- **Resume Parsing**: Integrate resume parsing APIs to extract skills automatically
- **ML Attrition Prediction**: Train classification model on historical attrition data
- **Real Database**: Migrate to PostgreSQL or MongoDB for persistence
- **Authentication**: Add user authentication and role-based access
- **Analytics Dashboard**: Add charts and trends for workforce analytics

## 📝 Technical Notes

- **Matching Algorithm**: Simple skill overlap with percentage scoring (matchedSkills / querySkills * 100)
- **Retention Scoring**: Rule-based scoring with cumulative risk factors (capped at 100)
- **Storage**: In-memory singleton store (resets on server restart)

---

Built for Hackathon 2026 🚀
