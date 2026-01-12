# Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up (free account)
2. Create a new project
3. Note your **Project URL** and **Anon Key** from Settings → API
4. Update `.env.local` with these values

## 2. Create the Database Schema

### In Supabase SQL Editor, run these commands:

```sql
-- Create recipes table
CREATE TABLE recipes (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  rating_average FLOAT DEFAULT 0,
  rating_count INT DEFAULT 0,
  prep_minutes INT DEFAULT 0,
  cook_minutes INT DEFAULT 0,
  total_minutes INT DEFAULT 0,
  protein_tags TEXT[] DEFAULT '{}',
  vegetables_tags TEXT[] DEFAULT '{}',
  cuisine_tags TEXT[] DEFAULT '{}',
  meal_type_tags TEXT[] DEFAULT '{}',
  method_tags TEXT[] DEFAULT '{}',
  ingredients JSONB NOT NULL DEFAULT '[]',
  procedure JSONB NOT NULL DEFAULT '[]',
  media JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_recipes_tags ON recipes USING GIN(protein_tags, vegetables_tags, cuisine_tags, meal_type_tags, method_tags);

-- Create storage bucket for recipe images
INSERT INTO storage.buckets (id, name, public) VALUES ('recipe-images', 'recipe-images', true);

-- Set bucket policies
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE USING (bucket_id = 'recipe-images');

CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE USING (bucket_id = 'recipe-images');
```

## 3. Update Your Environment Variables

Replace in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Next Steps

After setting up Supabase:
1. The app will automatically use Supabase for data storage
2. Images can be stored either as base64 (in the database) or in Supabase Storage
3. All CRUD operations will sync to the cloud
4. localStorage will be used as a fallback cache

## Troubleshooting

- If you get CORS errors, make sure your Supabase project allows requests from localhost:3000
- Check the Supabase dashboard for any SQL errors
- Monitor the Realtime tab in Supabase to see data changes
