#!/bin/bash

echo "=== Recipe App Production Diagnostics ==="
echo ""
echo "Checking environment variables..."
echo ""

if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_URL is NOT set"
else
  echo "✅ NEXT_PUBLIC_SUPABASE_URL is set"
  echo "   Value: ${NEXT_PUBLIC_SUPABASE_URL:0:30}..."
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is NOT set"
else
  echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set"
  echo "   Value: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:30}..."
fi

echo ""
echo "=== Instructions ==="
echo ""
echo "If variables are NOT set, you need to:"
echo ""
echo "For Vercel:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Select your recipe-app project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add:"
echo "   - NEXT_PUBLIC_SUPABASE_URL: https://ftoawekkbiqyadmrilnj.supabase.co"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY: sb_publishable_gS5CgyUJRPQc3f43rAE6fQ_VG568t6U"
echo "5. Click 'Save'"
echo "6. Go to Deployments and redeploy the latest build"
echo ""
echo "For other platforms, set the same two environment variables."
