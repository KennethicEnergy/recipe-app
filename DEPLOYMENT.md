# Production Deployment Guide

## Environment Variables Required

Your app requires these environment variables to work in production:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Deployment to Vercel

### Step 1: Push to GitHub
```bash
git push origin main
```

### Step 2: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"

### Step 3: Add Environment Variables
1. After importing, go to **Settings** → **Environment Variables**
2. Add the following:

   **Variable Name:** `NEXT_PUBLIC_SUPABASE_URL`
   **Value:** `https://ftoawekkbiqyadmrilnj.supabase.co` (your Supabase URL)

   **Variable Name:** `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   **Value:** `sb_publishable_gS5CgyUJRPQc3f43rAE6fQ_VG568t6U` (your Supabase anon key)

3. Click "Save"

### Step 4: Redeploy
1. Go to **Deployments**
2. Click the three dots on the latest deployment
3. Select "Redeploy"

## Local Testing (Production Build)

To test production locally:

```bash
npm run build     # Build the app
npm start         # Run production build
```

Your app will run at http://localhost:3000

**Important:** Environment variables from `.env.local` will be used. Make sure they're set correctly.

## Troubleshooting

### Issue: Data not loading or saving in production

**Solution:** Check that environment variables are set correctly in your deployment platform:
- Go to your deployment settings
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Redeploy your app

### Issue: Supabase connection errors

**Check:**
1. Are the environment variables correct?
2. Is your Supabase project still active?
3. Are RLS policies correctly set? (Should be disabled or have public policies)

### Issue: Data disappears after page refresh

**Reason:** The app loads data from Supabase on mount. If data isn't appearing:
1. Check Supabase dashboard → Table Editor → recipes table
2. Verify recipes are actually stored there
3. Check browser console for errors (F12 → Console)

## Environment Variables Checklist

- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Supabase `recipes` table exists
- [ ] RLS is disabled on `recipes` table
- [ ] You can see recipes in Supabase dashboard

If all items are checked and it's still not working, check the browser console for errors!
