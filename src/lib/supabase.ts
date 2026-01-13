import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Debug logging
if (typeof window === "undefined") {
  // Server side only
  console.log(
    "[Supabase] URL configured:",
    supabaseUrl ? "yes" : "no",
    supabaseUrl.substring(0, 20) + "..."
  );
  console.log("[Supabase] Key configured:", supabaseAnonKey ? "yes" : "no");
}

// Check if we have valid credentials
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith("https://");

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local",
    { url: supabaseUrl, key: supabaseAnonKey ? "set" : "not set" }
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseEnabled = isSupabaseConfigured;
