# HeartScan Deployment Guide

This guide covers deploying HeartScan with a separate Python API backend and Next.js frontend.

## Architecture Overview

```
┌─────────────────────┐
│   Next.js Frontend  │  (Vercel)
│   Port: 3000        │
└──────────┬──────────┘
           │ HTTP
           ▼
┌─────────────────────┐
│  FastAPI Backend    │  (Railway/Render)
│  Port: 8000         │
│  - Model Loading    │
│  - Predictions      │
│  - CORS Enabled     │
└─────────────────────┘
```

---

## Quick Start (Local Development)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`
- Docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install Node.js dependencies
npm install

# Copy environment file
cp .env.development .env.local

# Run Next.js development server
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Production Deployment

### Option 1: Railway (Recommended for Backend)

#### Backend Deployment to Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Deploy Backend**
   ```bash
   cd backend
   railway init
   railway up
   ```

4. **Set Environment Variables**
   ```bash
   railway variables set ENVIRONMENT=production
   railway variables set ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   ```

5. **Get your API URL**
   ```bash
   railway domain
   ```
   Save this URL (e.g., `https://heartscan-api.railway.app`)

#### Features:
- Free tier: 500 hours/month, 512MB RAM
- Automatic HTTPS
- Auto-scaling
- Built-in monitoring

---

### Option 2: Render (Alternative for Backend)

#### Backend Deployment to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Deploy backend"
   git push origin main
   ```

2. **Create New Web Service on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: heartscan-api
     - **Root Directory**: `backend`
     - **Environment**: Python 3
     - **Build Command**: `pip install -r requirements.txt`
     - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

3. **Set Environment Variables**
   ```
   ENVIRONMENT=production
   ALLOWED_ORIGINS=https://your-frontend-url.vercel.app
   PYTHON_VERSION=3.13
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (3-5 minutes)
   - Get your API URL: `https://heartscan-api.onrender.com`

#### Features:
- Free tier: 750 hours/month
- Auto-deploy on git push
- Free SSL certificates
- Easy rollback

---

### Frontend Deployment to Vercel

1. **Install Vercel CLI (Optional)**
   ```bash
   npm install -g vercel
   ```

2. **Set Environment Variable**

   Create `.env.production`:
   ```bash
   # Replace with your actual backend URL
   NEXT_PUBLIC_API_URL=https://heartscan-api.railway.app
   # or
   NEXT_PUBLIC_API_URL=https://heartscan-api.onrender.com
   ```

3. **Deploy to Vercel**

   **Method A: Using Vercel CLI**
   ```bash
   vercel --prod
   ```

   **Method B: Using GitHub (Recommended)**
   - Push code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Set environment variable:
     - Key: `NEXT_PUBLIC_API_URL`
     - Value: `https://your-backend-url.railway.app`
   - Click "Deploy"

4. **Update Backend CORS**
   After deployment, update your backend's `ALLOWED_ORIGINS`:
   ```bash
   # On Railway
   railway variables set ALLOWED_ORIGINS=https://your-app.vercel.app

   # On Render
   # Go to Dashboard → Environment → Add ALLOWED_ORIGINS
   ```

---

## Environment Variables

### Backend (.env)

```bash
ENVIRONMENT=production
PORT=8000
ALLOWED_ORIGINS=https://your-frontend.vercel.app,http://localhost:3000
PYTHON_VERSION=3.13
```

### Frontend (.env.local / .env.production)

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.railway.app
```

---

## Testing Deployment

### 1. Test Backend API

```bash
# Health check
curl https://your-backend-url.railway.app/health

# Test prediction
curl -X POST https://your-backend-url.railway.app/predict \
  -H "Content-Type: application/json" \
  -d '{
    "age": 58,
    "sex": 0,
    "cp": 0,
    "trestbps": 100,
    "chol": 248,
    "fbs": 0,
    "restecg": 0,
    "thalach": 122,
    "exang": 0,
    "oldpeak": 1.0,
    "slope": 1,
    "ca": 0,
    "thal": 2
  }'
```

Expected response:
```json
{
  "prediction": "Positive",
  "probability": 0.8542,
  "confidence": 0.8542,
  "risk_level": "High",
  "timestamp": "2025-12-19T10:30:00.000Z"
}
```

### 2. Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Navigate to the assessment form
3. Fill in sample data
4. Submit and verify prediction results display correctly

### 3. Test API Integration

```bash
# From your frontend domain
curl https://your-app.vercel.app/api/predict/health
```

---

## Monitoring & Logs

### Railway
```bash
railway logs
```

### Render
- Dashboard → Logs tab
- Real-time log streaming

### Vercel
- Dashboard → Deployments → View Function Logs

---

## Troubleshooting

### CORS Errors

**Problem**: "Access blocked by CORS policy"

**Solution**:
1. Check backend `ALLOWED_ORIGINS` includes your frontend URL
2. Verify frontend is using correct API URL
3. Check browser console for exact error

```bash
# Railway
railway variables set ALLOWED_ORIGINS=https://your-frontend.vercel.app

# Render
# Update environment variable in dashboard
```

### API Connection Refused

**Problem**: "ECONNREFUSED" or "503 Service Unavailable"

**Solution**:
1. Verify backend is running: `curl https://your-api-url/health`
2. Check `NEXT_PUBLIC_API_URL` is set correctly
3. Ensure Railway/Render service is active (not sleeping)

### Model Loading Errors

**Problem**: "Failed to load model"

**Solution**:
1. Verify `backend/model/` directory contains:
   - `heart_RandomForest.pkl`
   - `scaler.pkl`
2. Check file permissions
3. Verify Python dependencies are installed

### Railway Free Tier Sleep

Railway free tier services sleep after 5 minutes of inactivity.

**Solution**:
- First request may take 5-10 seconds (cold start)
- Upgrade to paid plan for always-on service
- Or use Render (doesn't sleep as aggressively)

---

## Cost Estimates

### Railway (Free Tier)
- 500 execution hours/month
- 512MB RAM, 1GB disk
- Cost: **$0/month** (within limits)

### Render (Free Tier)
- 750 execution hours/month
- Auto-sleep after 15 min inactivity
- Cost: **$0/month**

### Vercel (Hobby Plan)
- Unlimited bandwidth
- 100GB bandwidth/month
- Cost: **$0/month**

**Total: $0/month** for hobby projects

---

## Scaling to Production

When you need to handle more traffic:

### Backend Scaling
1. **Railway Pro**: $5/month
   - 8GB RAM
   - Always-on
   - Auto-scaling

2. **Render Standard**: $7/month
   - 512MB RAM minimum
   - Always-on
   - Zero-downtime deploys

### Frontend Scaling
- Vercel Pro: $20/month
  - Priority support
  - Advanced analytics
  - Team collaboration

---

## Security Checklist

- [ ] Backend CORS restricted to production frontend URL only
- [ ] Environment variables set (not hardcoded)
- [ ] HTTPS enabled on both services
- [ ] API rate limiting configured (optional)
- [ ] Health check endpoints working
- [ ] Error messages don't expose sensitive data
- [ ] Model files secured (not publicly accessible)

---

## Continuous Deployment

### Railway Auto-Deploy
```bash
# Railway automatically deploys on git push to main
git push origin main
```

### Render Auto-Deploy
- Enable "Auto-Deploy" in dashboard
- Pushes to main branch trigger deploy

### Vercel Auto-Deploy
- Automatic on git push
- Preview deployments for branches
- Production deploys for main branch

---

## Support

If you encounter issues:

1. Check logs:
   - Railway: `railway logs`
   - Render: Dashboard → Logs
   - Vercel: Dashboard → Function Logs

2. Verify environment variables are set correctly

3. Test API endpoints individually:
   - `/health` - Backend status
   - `/predict` - Prediction endpoint
   - `/api/predict` - Next.js proxy

4. Check CORS configuration matches your domains

---

## API Documentation

Once deployed, your API documentation is available at:

- **Swagger UI**: `https://your-api-url/docs`
- **ReDoc**: `https://your-api-url/redoc`

These provide interactive API testing and schema documentation.

---

## Quick Reference

### Commands

```bash
# Backend
cd backend && uvicorn main:app --reload            # Dev
railway up                                          # Deploy Railway

# Frontend
npm run dev                                         # Dev
vercel --prod                                       # Deploy Vercel

# Testing
curl https://api-url/health                        # Backend health
curl https://frontend-url/api/predict             # Frontend proxy
```

### URLs

- Local Backend: `http://localhost:8000`
- Local Frontend: `http://localhost:3000`
- API Docs: `https://your-api-url/docs`
- Production: `https://your-app.vercel.app`

---

**Deployment Complete!** Your HeartScan application should now be live and accessible to users worldwide.
