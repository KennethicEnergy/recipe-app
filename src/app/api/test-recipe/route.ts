import { supabase, isSupabaseEnabled } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (!isSupabaseEnabled || !supabase) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 400 }
    );
  }

  try {
    const recipe = {
      id: `test_${Date.now()}`,
      name: "Test Recipe",
      description: "This is a test recipe",
      rating_average: 4.5,
      rating_count: 10,
      prep_minutes: 10,
      cook_minutes: 20,
      total_minutes: 30,
      protein_tags: ["chicken"],
      vegetables_tags: ["broccoli"],
      cuisine_tags: ["asian"],
      meal_type_tags: ["dinner"],
      method_tags: ["bake"],
      ingredients: [{ name: "chicken", type: "meat", amount: "1 lb" }],
      procedure: [{ step: 1, instruction: "Cook the chicken" }],
      media: { images: [] },
    };

    console.log("Attempting to insert recipe:", recipe);

    const { data, error } = await supabase
      .from("recipes")
      .insert([recipe])
      .select();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
        { status: 400 }
      );
    }

    console.log("Insert successful:", data);
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Catch error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
