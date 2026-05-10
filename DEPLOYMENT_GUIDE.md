# 🚀 Complete Deployment Guide: HR Portal (Render + Vercel)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB Atlas** account (free tier works)
- **Render** account (free tier available)
- **Vercel** account (free tier available)
- **Git** installed locally
- **GitHub/GitLab/Bitbucket** repository

---

## 🗂️ Project Structure

```
HR Portol/
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── models/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── middleware/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
└── render.yaml            # Render configuration
```

---

## 🔧 Backend Setup (Render)

### 1. Environment Variables

Create `server/.env` with:

```env
NODE_ENV=production
PORT=5000

# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hrportal?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS - Your Vercel frontend URL
CLIENT_URL=https://your-app-name.vercel.app
```

### 2. Package.json Scripts

Ensure your `server/package.json` has these scripts:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'No build step required for Node.js'"
  }
}
```

### 3. Health Check Endpoint

Your `server/server.js` should include:

```javascript
// Add this endpoint for Render health checks
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

### 4. Render Configuration

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: hr-portal-api
    runtime: node
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
      - key: CLIENT_URL
        sync: false
```

---

## 🎨 Frontend Setup (Vercel)

### 1. Environment Variables

Create `client/.env` with:

```env
VITE_API_URL=https://your-app-name.onrender.com/api
```

### 2. Vercel Configuration

Create `client/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "build": {
    "env": {
      "VITE_API_URL": "@vite_api_url"
    }
  }
}
```

### 3. Build Configuration

Ensure `client/vite.config.ts` has proper build settings:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
});
```

---

## 🚀 Deployment Steps

### Step 1: Push to Git Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Ready for deployment"

# Add remote and push
git remote add origin https://github.com/yourusername/hr-portal.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend to Render

1. **Sign up/login to [Render](https://render.com)**
2. Click **"New +"** → **"Web Service"**
3. **Connect Repository**: Select your GitHub repo
4. **Configure Service**:
   - **Name**: `hr-portal-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` (or paid for production)
5. **Environment Variables**: Add all variables from `server/.env`
6. Click **"Create Web Service"**

### Step 3: Deploy Frontend to Vercel

1. **Sign up/login to [Vercel](https://vercel.com)**
2. Click **"New Project"**
3. **Import Repository**: Select your GitHub repo
4. **Configure Project**:
   - **Root Directory**: `client`
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - `VITE_API_URL`: `https://your-app-name.onrender.com/api`
6. Click **"Deploy"**

---

## 🔗 Post-Deployment Configuration

### 1. Update CORS Settings

After Render deployment, update your `server/.env`:

```env
CLIENT_URL=https://your-app-name.vercel.app
```

And redeploy the backend.

### 2. Test API Endpoints

```bash
# Test health endpoint
curl https://your-app-name.onrender.com/api/health

# Test authentication
curl https://your-app-name.onrender.com/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

### 3. Verify Frontend

Visit `https://your-app-name.vercel.app` and test:
- Login functionality
- Dashboard loading
- CRUD operations
- File uploads (if applicable)

---

## 🛠️ Troubleshooting

### Common Issues

#### 1. CORS Errors
```env
# In server/.env
CLIENT_URL=https://your-app-name.vercel.app
```

#### 2. MongoDB Connection
```env
# Ensure IP is whitelisted in MongoDB Atlas
# Network Access → Add IP Address → 0.0.0.0/0 (for all IPs)
```

#### 3. Build Failures
```bash
# Clear node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. Environment Variables Not Loading
```bash
# Verify .env file is in correct directory
# Check Vercel dashboard for env vars
# Check Render dashboard for env vars
```

### Debug Mode

#### Render Logs
1. Go to Render dashboard
2. Click on your service
3. Click **"Logs"** tab
4. Check for errors

#### Vercel Logs
1. Go to Vercel dashboard
2. Click on your project
3. Click **"Logs"** tab
4. Check build and runtime logs

---

## 📊 Performance Optimization

### Backend (Render)

1. **Enable Caching**:
```javascript
// Add to server.js
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'public, max-age=31536000');
  next();
});
```

2. **Database Indexing**:
```javascript
// In your models
userSchema.index({ email: 1 });
internSchema.index({ user_id: 1 });
```

### Frontend (Vercel)

1. **Code Splitting**:
```typescript
// Lazy load components
const Interns = lazy(() => import('./pages/Interns'));
```

2. **Image Optimization**:
```typescript
// Use Next.js Image component or optimize manually
<img src="/logo.png" alt="Logo" loading="lazy" />
```

---

## 🔒 Security Best Practices

### Backend Security

1. **Rate Limiting**:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests
});

app.use('/api/', limiter);
```

2. **Helmet.js**:
```javascript
import helmet from 'helmet';
app.use(helmet());
```

3. **Input Validation**:
```javascript
import { body, validationResult } from 'express-validator';

// Add validation to routes
app.post('/api/auth/login', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Process login
});
```

### Frontend Security

1. **Environment Variables**:
   - Never expose sensitive data in frontend env vars
   - Use `VITE_` prefix for all environment variables

2. **Content Security Policy**:
```json
// In client/public/index.html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';">
```

---

## 📱 Monitoring and Analytics

### Render Monitoring

1. **Metrics Dashboard**: Built-in monitoring in Render dashboard
2. **Error Tracking**: Add Sentry or similar service
3. **Performance**: Use Render's built-in performance metrics

### Vercel Analytics

1. **Vercel Analytics**: Built-in traffic and performance analytics
2. **Speed Insights**: Core Web Vitals monitoring
3. **Build Analytics**: Build time and performance metrics

---

## 🔄 CI/CD Pipeline

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: |
          cd client
          npm ci
          npm run build
          cd ../server
          npm ci

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        uses: github/render-deploy-action@v1
        with:
          service-id: your-render-service-id
          api-key: ${{ secrets.RENDER_API_KEY }}
```

---

## 📝 Checklist Before Going Live

- [ ] All environment variables set correctly
- [ ] MongoDB Atlas IP whitelist configured
- [ ] CORS settings updated with production URLs
- [ ] SSL certificates active (automatic on Render/Vercel)
- [ ] Health check endpoint working
- [ ] Error handling implemented
- [ ] Rate limiting configured
- [ ] Database backups enabled (MongoDB Atlas)
- [ ] Monitoring setup
- [ ] Domain customizations (if needed)
- [ ] Email templates configured (if using emails)

---

## 🆘 Support Resources

- **Render Documentation**: https://render.com/docs
- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/atlas
- **Node.js Best Practices**: https://github.com/goldbergyoni/nodebestpractices
- **React Best Practices**: https://react.dev/learn

---

## 🎉 You're Live!

Your HR Portal is now deployed and accessible:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-app-name.onrender.com/api`
- **API Docs**: `https://your-app-name.onrender.com/api/health`

For any issues, check the logs in Render and Vercel dashboards, and refer to the troubleshooting section above.
