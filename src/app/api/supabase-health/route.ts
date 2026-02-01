import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  if (!isSupabaseEnabled || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured", configured: false },
      { status: 400 }
    );
  }

  try {
    // Try to query the recipes table
    const { data, error } = await supabase
      .from("recipes")
      .select("count", { count: "exact" });

    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          hint: "Make sure you've run the SQL setup from SUPABASE_SETUP.md",
          configured: true,
          tableExists: false,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: "Connected to Supabase",
      configured: true,
      tableExists: true,
      recipesCount: data?.length || 0,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Unknown error",
        configured: true,
        tableExists: false,
      },
      { status: 500 }
    );
  }
}
