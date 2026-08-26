# 🚀 Deployment Guide & Requirements

This document outlines the system requirements, environment variables, Docker setup, and step-by-step instructions to deploy this application to popular hosting platforms (**Render**, **Railway**, **Fly.io**, **AWS / GCP**, or any **Docker VPS**).

---

## 📋 System & Software Requirements

| Component | Required Version |
| :--- | :--- |
| **Node.js** | `>= 18.0.0` (LTS recommended) |
| **npm** | `>= 9.0.0` |
| **Docker** (Optional) | `>= 20.10.0` |
| **Database** | Supabase / PostgreSQL (`>= 14`) |

---

## 🔑 Required Environment Variables

When deploying to any cloud hosting service, set the following environment variables:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | HTTP port | `4000` |
| `DATABASE_URL` | Supabase Transaction Pooler URL | `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `DIRECT_URL` | Supabase Direct / Session URL | `postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres` |

---

## 🐳 Docker Deployment

### 1. Build and Run with Docker Compose
```bash
docker compose up -d --build
```
The application will be accessible at `http://localhost:4000`.

### 2. Build and Run Standalone Docker Image
```bash
# Build image
docker build -t talent-app .

# Run container with environment variables
docker run -p 4000:4000 \
  -e DATABASE_URL="your-supabase-database-url" \
  -e DIRECT_URL="your-supabase-direct-url" \
  -e NODE_ENV=production \
  talent-app
```

---

## ☁️ Deploying to Cloud Platforms

### 1. Render (Recommended - Free Tier)
1. Push your code to GitHub.
2. Go to [dashboard.render.com](https://dashboard.render.com) $\rightarrow$ **New +** $\rightarrow$ **Web Service**.
3. Connect your GitHub repository.
4. Select **Docker** as the runtime (Render will automatically detect `Dockerfile` and `render.yaml`).
5. Under **Environment Variables**, add:
   * `DATABASE_URL`: *(Your Supabase transaction pooler URL)*
   * `DIRECT_URL`: *(Your Supabase session pooler URL)*
   * `NODE_ENV`: `production`
6. Click **Create Web Service**.

---

### 2. Railway
1. Go to [railway.app](https://railway.app) $\rightarrow$ **New Project** $\rightarrow$ **Deploy from GitHub repo**.
2. Railway detects the `Dockerfile` automatically.
3. Add `DATABASE_URL`, `DIRECT_URL`, and `PORT=4000` in the **Variables** tab.
4. Under **Settings**, generate a public domain name.

---

### 3. Fly.io
1. Install Flyctl and log in: `fly auth login`.
2. Initialize app: `fly launch`.
3. Set secrets:
   ```bash
   fly secrets set DATABASE_URL="your-url" DIRECT_URL="your-url"
   ```
4. Deploy: `fly deploy`.
