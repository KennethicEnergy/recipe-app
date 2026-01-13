# 🚨 URGENT: Fix Production Supabase Connection

## What's Happening

Your production app is showing:
```
[RecipeContext] Supabase URL configured: no
```

This means **environment variables are NOT set** in your production platform.

## ✅ IMMEDIATE ACTION REQUIRED

### Where is your app deployed?

#### **Option A: If on Vercel**

1. **Open:** https://vercel.com/dashboard
2. **Select:** Your `recipe-app` project
3. **Click:** Settings (top navigation bar)
4. **Click:** Environment Variables (left sidebar under "Project Settings")
5. **Look for these two variables:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Are they there?**

**YES** → Skip to "Redeploy" section below

**NO** → Add them now:

**Click "Add Variable" twice and enter:**

**Variable 1:**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://ftoawekkbiqyadmrilnj.supabase.co
Production: ✓ (checked)
```
Click "Save"

**Variable 2:**
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: sb_publishable_gS5CgyUJRPQc3f43rAE6fQ_VG568t6U
Production: ✓ (checked)
```
Click "Save"

#### **Option B: If on another platform (AWS, Firebase Hosting, Netlify, etc.)**

Look for "Environment Variables" or "Config" section in your platform's settings and add the same two variables above.

#### **Option C: If on Netlify**

1. Go to Site settings → Build & deploy → Environment
2. Click "Edit variables"
3. Add the two variables above
4. Save

## 🔄 Redeploy Your App

### For Vercel:
1. Go to **Deployments** (top navigation)
2. Find your latest deployment (usually at the top)
3. Click the three dots (...) on the right
4. Click **Redeploy**
5. Wait for green checkmark ✅

### For Netlify:
1. Go to **Deploys**
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete

### For other platforms:
Look for a "Redeploy" or "Trigger build" button

## ✅ Verify It Works

After deployment completes:

1. **Open your production app URL** (e.g., https://your-app.vercel.app)
2. **Open browser console** (F12 or Right-click → Inspect)
3. **Look for these logs:**
   ```
   [RecipeContext] Supabase URL configured: yes ✅
   [supabaseRecipes] Adding recipe to Supabase
   ```
4. **Add a test recipe**
5. **Go to Supabase dashboard** → Table Editor → recipes table
6. **Your recipe should appear there!** ✅

## 📋 Checklist

- [ ] I found my deployment platform settings
- [ ] I added `NEXT_PUBLIC_SUPABASE_URL` environment variable
- [ ] I added `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable
- [ ] I clicked "Save" or equivalent on both
- [ ] I redeployed my app
- [ ] I tested adding a recipe
- [ ] I saw it appear in Supabase dashboard

## 🆘 Still Not Working?

**Step 1: Check console logs again**
- Do you see `[RecipeContext] Supabase URL configured: yes` now?
- If NO → Environment variables still not set, repeat steps above

**Step 2: Check Supabase is online**
- Go to https://supabase.com/dashboard
- Is your project status showing "active"?
- If NO → Activate your project

**Step 3: Check RLS policies**
- In Supabase → recipes table → RLS tab
- Should say "RLS is OFF" or have public policies
- If you see locks 🔒 → You need to disable RLS

**Step 4: Share console errors**
Look for any error messages starting with:
- `[supabaseRecipes] Error`
- `Error adding recipe to Supabase:`
- Take a screenshot and note exact error message

Then it's easier to debug!
