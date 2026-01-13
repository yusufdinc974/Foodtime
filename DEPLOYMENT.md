# FOOD TIME - Quick Deployment Guide

## 🚀 Deploy to Railway + Vercel

### Step 1: Deploy Backend to Railway

1. **Go to [railway.app](https://railway.app) and sign up**

2. **Create New Project:**
   ```
   Click "New Project" → "Deploy from GitHub repo"
   Or click "Empty Project" if not using Git
   ```

3. **Add PostgreSQL Database:**
   ```
   Click "New" → "Database" → "Add PostgreSQL"
   ```

4. **Deploy Backend:**
   ```
   Click "New" → "GitHub Repo" → Select "foodtime-backend"
   Or: Click "Deploy from local" and select the backend folder
   ```

5. **Set Environment Variables in Railway:**
   ```
   Go to your backend service → Variables tab
   
   Add these variables:
   - GEMINI_API_KEY: your_gemini_api_key
   - SECRET_KEY: (generate with: openssl rand -hex 32)
   - BACKEND_CORS_ORIGINS: ["https://your-app.vercel.app"]
   
   Note: DATABASE_URL is auto-provided by Railway PostgreSQL
   ```

6. **Get your backend URL:**
   ```
   Go to Settings → Generate Domain
   Copy the URL: https://your-app.up.railway.app
   ```

### Step 2: Deploy Frontend to Vercel

1. **Go to [vercel.com](https://vercel.com) and sign up**

2. **Import Project:**
   ```
   Click "Add New" → "Project"
   Import your GitHub/GitLab repo
   Or upload the foodtime-frontend folder
   ```

3. **Configure Build Settings:**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable:**
   ```
   Go to Settings → Environment Variables
   
   Add:
   - Name: VITE_API_URL
   - Value: https://your-app.up.railway.app (your Railway backend URL)
   - Environment: Production
   ```

5. **Deploy:**
   ```
   Click "Deploy"
   Wait for deployment to complete
   ```

6. **Get your frontend URL:**
   ```
   Copy the URL: https://your-app.vercel.app
   ```

### Step 3: Update CORS

1. **Go back to Railway:**
   ```
   Backend service → Variables
   Update BACKEND_CORS_ORIGINS:
   ["https://your-app.vercel.app"]
   
   Save and redeploy
   ```

### Step 4: Test Your App! 🎉

1. Visit your Vercel URL
2. Sign up for an account
3. Log meals and test AI analysis
4. Check nutrition tracking
5. View weekly reports

---

## 📝 Environment Variables Checklist

### Railway (Backend):
- [x] GEMINI_API_KEY
- [x] SECRET_KEY
- [x] BACKEND_CORS_ORIGINS
- [x] DATABASE_URL (auto-provided)

### Vercel (Frontend):
- [x] VITE_API_URL

---

## 🔧 Troubleshooting

**Issue: CORS Error**
```
Update BACKEND_CORS_ORIGINS in Railway to include your Vercel URL
```

**Issue: Database Connection Error**
```
Make sure PostgreSQL is added in Railway and DATABASE_URL is set
```

**Issue: API Not Found**
```
Make sure VITE_API_URL in Vercel matches your Railway backend URL
```

**Issue: Build Failed**
```
Check that all dependencies are in package.json and requirements.txt
```

---

## 🎯 Next Steps After Deployment

1. **Add Custom Domain (Optional):**
   - Buy domain from Namecheap/Google Domains
   - Add to Vercel: Settings → Domains
   - Add to Railway: Settings → Networking

2. **Monitor Your App:**
   - Railway: Check logs and metrics
   - Vercel: Analytics and performance

3. **Set Up Backups:**
   - Railway: Database backups are automatic
   - Export environment variables for safekeeping

4. **Share with Users:**
   - Test all features
   - Gather feedback
   - Iterate improvements

---

**Deployment Complete! 🚀**

Your FOOD TIME app is now live at:
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.up.railway.app
