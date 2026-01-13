# Production Deployment Checklist

## Quick Start

If you're deploying to production (Vercel, etc.), follow these steps:

### 1. Verify Supabase Setup
- [ ] Go to https://supabase.com/dashboard
- [ ] Verify your `recipes` table exists
- [ ] Verify RLS is disabled on the `recipes` table
- [ ] Get your credentials:
  - `Project URL` (Supabase URL)
  - `Anon Key`

### 2. Set Environment Variables in Deployment Platform

**For Vercel:**
1. Go to your project settings
2. Navigate to Settings → Environment Variables
3. Add two variables:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
4. Save and redeploy

**For Other Platforms:**
Set the same two environment variables in your platform's settings.

### 3. Redeploy Your Application

**Vercel:** Simply click "Redeploy" on your latest deployment

### 4. Test It Works

After deployment:
1. Visit your production URL
2. Add a new recipe
3. Refresh the page
4. Recipe should still be there
5. Go to Supabase dashboard and verify it's in the database

## Troubleshooting

### "Table is empty in production"

**Cause:** Environment variables not set in deployment platform

**Solution:**
1. Check your deployment platform settings
2. Verify both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
3. Redeploy the application

### "Recipes aren't loading on page load"

**Check:**
1. Open browser console (F12)
2. Look for "[RecipeContext]" logs
3. Verify Supabase URL is configured
4. If still blank, check Supabase dashboard for data

### "Can add recipe but it disappears after refresh"

**Cause:** Data only saved to localStorage, not Supabase

**Solution:**
1. Check environment variables are set
2. Verify Supabase table RLS is disabled
3. Check browser console for Supabase errors

## Local Testing

To test production build locally:

```bash
# Build the production bundle
npm run build

# Run the production server
npm start

# Visit http://localhost:3000
```

This will use your `.env.local` file. Make sure it has your Supabase credentials.

## Vercel Deployment Button

If you want a quick deploy to Vercel:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/KennethicEnergy/recipe-app&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

Click the button and it will prompt you for environment variables during setup.
