# Production Troubleshooting Guide

## Quick Test: Is Your Production App Connected to Supabase?

Open your browser console (F12 → Console tab) and look for logs like:
```
[RecipeContext] Supabase URL configured: yes
[supabaseRecipes] Adding recipe to Supabase: recipe_...
[supabaseRecipes] Recipe added successfully to Supabase
```

If you see these messages → **Supabase is connected! ✅**

If you see:
```
[RecipeContext] Supabase URL configured: no
```

Then **STOP** - your environment variables are not set in production.

## Step-by-Step Fix

### Are you using Vercel?

**If YES:**

1. Go to https://vercel.com/dashboard
2. Click on your **recipe-app** project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)
5. You should see TWO variables already set:
   - ✅ `NEXT_PUBLIC_SUPABASE_URL`
   - ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**If you don't see these TWO variables, add them now:**

Click "Add Variable" and fill in:

**First Variable:**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: `https://ftoawekkbiqyadmrilnj.supabase.co`
- Click "Save"

**Second Variable:**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: `sb_publishable_gS5CgyUJRPQc3f43rAE6fQ_VG568t6U`
- Click "Save"

6. Go to **Deployments** (top navigation)
7. Find your latest deployment (usually at the top)
8. Click the three dots (...) on the right
9. Click **Redeploy**
10. Wait for deployment to complete
11. Test your app!

### Are you using a different platform?

Check your platform's documentation on how to set environment variables, then add:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Then redeploy.

## Verify It's Working

1. Go to your production app URL
2. Open browser console (F12)
3. Add a new recipe
4. Look in console for `[RecipeContext]` and `[supabaseRecipes]` logs
5. Go to Supabase dashboard → Table Editor → recipes table
6. Your recipe should appear there! ✅

## If It Still Doesn't Work

1. Check the browser console for error messages
2. Look for error details like:
   - "CORS error" → Check Supabase CORS settings
   - "Permission denied" → Check RLS policies (should be disabled)
   - "Invalid credentials" → Check environment variables are correct

3. Take a screenshot of the console error
4. Check your Supabase project status (is it still active?)

## Need Help?

Look for these console logs and note what you see:
- `[RecipeContext] Supabase URL configured: ...`
- `[RecipeContext] Attempting to fetch recipes from Supabase`
- `[supabaseRecipes] Adding recipe to Supabase`
- Any error messages with `code:` or `hint:` fields
