# 🚀 Quick Start Guide

Complete setup guide for the React + Supabase Real-time Financial Tracker. Follow these steps to get your application running locally and deploy it to production.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed ([Download here](https://nodejs.org/))
- ✅ **pnpm** package manager ([Install guide](https://pnpm.io/installation))
- ✅ **Supabase account** ([Sign up free](https://supabase.com))
- ✅ **Git** (for deployment)

---

## 🏁 Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd react-supabase-realtime-interaction

# Install dependencies
pnpm install
```

---

## 🗄️ Step 2: Set Up Supabase Database

### A. Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `financial-tracker` (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your users
4. Click **"Create new project"** and wait ~2 minutes

### B. Run Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Copy and paste the contents of **`supabase-schema.sql`**
4. Click **"Run"** (or press F5)
5. ✅ You should see: "Success. No rows returned"

### C. Configure Real-time for DELETE Events

1. In the same **SQL Editor**, create a **new query**
2. Copy and paste the contents of **`supabase-realtime-fix.sql`**:

```sql
-- Set REPLICA IDENTITY FULL for all tables
ALTER TABLE transactions REPLICA IDENTITY FULL;
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER TABLE budgets REPLICA IDENTITY FULL;
```

3. Click **"Run"**
4. ✅ This enables DELETE events for real-time synchronization

### D. Verify Setup

Run this query to verify everything is configured correctly:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('transactions', 'categories', 'budgets');

-- Check if realtime is enabled
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- Verify REPLICA IDENTITY
SELECT 
  tablename, 
  CASE relreplident 
    WHEN 'f' THEN 'FULL ✅' 
    ELSE 'NOT SET ❌'
  END as replica_identity
FROM pg_class 
JOIN pg_tables ON pg_tables.tablename = pg_class.relname
WHERE tablename IN ('transactions', 'categories', 'budgets');
```

**Expected Results:**
- All 3 tables should have `rowsecurity = true`
- All 3 tables should appear in realtime publication
- All 3 tables should have `FULL ✅` replica identity

---

## 🔑 Step 3: Configure Environment Variables

### A. Get Your Supabase Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

### B. Create `.env` File

```bash
# In your project root, create .env file
cp .env.example .env
```

### C. Edit `.env`

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Never commit `.env` to Git!** (Already in `.gitignore`)

---

## 🎨 Step 4: Configure Email Authentication (Optional)

By default, Supabase uses their email service. For production, configure a custom SMTP provider.

1. Go to **Authentication** → **Email Templates**
2. Customize email templates (optional)
3. Go to **Settings** → **Auth**
4. Enable/disable email confirmation as needed
5. Configure SMTP (for production):
   - **SMTP Host**: Your email provider
   - **SMTP Port**: Usually 587 or 465
   - **SMTP User/Password**: Your credentials

**Popular SMTP Providers:**
- SendGrid
- Mailgun
- Amazon SES
- Resend

---

## 🏃 Step 5: Run Locally

```bash
# Start development server
pnpm run dev
```

🎉 **Open http://localhost:5173** in your browser!

### Test the Application

1. **Register a new account**
   - Use a real email (you'll need to verify it)
   - Check your inbox for verification email
   - Click the verification link

2. **Login**
   - Use your verified credentials
   - You'll be redirected to the Dashboard

3. **Test Features**
   - Add transactions, categories, and budgets
   - Open another browser tab to test real-time sync
   - Try dark mode toggle
   - Delete items and watch them disappear instantly!

---

## 📦 Step 6: Build for Production

```bash
# Create optimized production build
pnpm run build

# Preview the production build locally
pnpm run preview
```

The build output will be in the `dist/` folder.

---

## 🚀 Step 7: Deploy to Production

### Option 1: Deploy to Vercel (Recommended)

Vercel is perfect for React apps with zero configuration.

#### A. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### B. Deploy on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your anon key
6. Click **"Deploy"**

✅ **Done!** Your app will be live at `https://your-app.vercel.app`

---

### Option 2: Deploy to Netlify

#### A. Push to GitHub (if not done already)

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

#### B. Deploy on Netlify

1. Go to [Netlify](https://app.netlify.com/start)
2. Click **"Import from Git"** → Select your repo
3. Configure:
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
4. Click **"Advanced"** → **"New variable"**
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
5. Click **"Deploy site"**

✅ **Live at** `https://your-app.netlify.app`

---

### Option 3: Deploy to Railway

Railway is great for full-stack apps and offers simple deployment.

1. Go to [Railway](https://railway.app)
2. Click **"Start a New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway auto-detects Vite
5. Add environment variables in **Variables** tab:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Click **"Deploy"**

✅ **Deployed!** Railway provides a URL automatically.

---

### Option 4: Deploy to Your Own Server

#### Build the App

```bash
pnpm run build
```

#### Serve with Nginx

1. Upload `dist/` folder to your server
2. Configure Nginx:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/your-app/dist;
    index index.html;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. Restart Nginx:

```bash
sudo systemctl restart nginx
```

---

## 🔒 Step 8: Production Configuration

### A. Update Supabase Settings

1. **Add Production URL to Allowed Redirect URLs**
   - Go to **Authentication** → **URL Configuration**
   - Add your production domain:
     - `https://yourdomain.com/`
     - `https://yourdomain.com/**`

2. **Configure Site URL**
   - Set **Site URL** to: `https://yourdomain.com`

3. **Review RLS Policies**
   - Ensure all tables have proper RLS policies
   - Test with different user accounts

### B. Security Checklist

- ✅ Environment variables are set correctly
- ✅ `.env` is NOT committed to Git
- ✅ RLS is enabled on all tables
- ✅ Email verification is required
- ✅ HTTPS is enabled (automatic on Vercel/Netlify)
- ✅ CORS is configured (if needed)

---

## 🧪 Testing Your Deployment

### 1. Test Authentication
- Register a new user
- Verify email works
- Login/Logout

### 2. Test CRUD Operations
- Create transactions, categories, budgets
- Edit items
- Delete items

### 3. Test Real-time Sync
- Open app in two different browsers
- Make changes in one
- Verify they appear instantly in the other

### 4. Test on Mobile
- Open on your phone
- Check responsive design
- Test all features

---

## 🛠️ Troubleshooting

### Issue: "Invalid API Key"
**Solution:** Double-check your `VITE_SUPABASE_ANON_KEY` in `.env`

### Issue: "CORS Error"
**Solution:** Add your domain to Supabase allowed origins:
- **Settings** → **API** → **Allowed origins**

### Issue: "Email not being sent"
**Solution:** 
1. Check Supabase email logs: **Authentication** → **Logs**
2. Configure custom SMTP for production

### Issue: "DELETE events not working"
**Solution:** Ensure you ran the `supabase-realtime-fix.sql` script:
```sql
ALTER TABLE transactions REPLICA IDENTITY FULL;
ALTER TABLE categories REPLICA IDENTITY FULL;
ALTER TABLE budgets REPLICA IDENTITY FULL;
```

### Issue: "Real-time not syncing"
**Solution:**
1. Check browser console for errors
2. Verify Realtime is enabled in Supabase: **Database** → **Replication**
3. Ensure tables are added to `supabase_realtime` publication

---

## 📊 Monitoring & Analytics (Optional)

### Add Analytics

**Google Analytics:**
```bash
pnpm add react-ga4
```

**PostHog:**
```bash
pnpm add posthog-js
```

### Monitor Supabase Usage

- **Dashboard** → **Reports**
- Check:
  - Database usage
  - Bandwidth
  - Active users
  - API requests

---

## 🎯 Next Steps

After successful deployment:

1. ✅ **Set up custom domain** (via your hosting provider)
2. ✅ **Configure email templates** in Supabase
3. ✅ **Add analytics** (Google Analytics, PostHog, etc.)
4. ✅ **Set up monitoring** (Sentry for error tracking)
5. ✅ **Create backups** (Supabase auto-backups for paid plans)
6. ✅ **Add more features** (export to CSV, charts, etc.)

---

## 📚 Additional Resources

- **[Supabase Documentation](https://supabase.com/docs)**
- **[Vite Guide](https://vitejs.dev/guide/)**
- **[React Router](https://reactrouter.com/)**
- **[Tailwind CSS v4](https://tailwindcss.com/docs)**
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Advanced deployment options

---

## 💬 Need Help?

- 🐛 **Found a bug?** Open an issue on GitHub
- 💡 **Have a question?** Check existing issues first
- 📖 **Read the docs:** [README.md](./README.md)

---

**🎉 Congratulations! Your financial tracker is now live!**

Built with ❤️ using React, Supabase, and Tailwind CSS
