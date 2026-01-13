import { supabase, isSupabaseEnabled } from "./supabase";
import { Recipe } from "@/types/recipe";

export const supabaseRecipes = {
  // Fetch all recipes
  async getAll(): Promise<Recipe[]> {
    if (!isSupabaseEnabled || !supabase) {
      return [];
    }
    const { data, error } = await supabase.from("recipes").select("*");
    if (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }
    return (data || []).map(transformFromDB);
  },

  // Fetch single recipe
  async getById(id: string): Promise<Recipe | null> {
    if (!isSupabaseEnabled || !supabase) {
      return null;
    }
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching recipe:", error);
      return null;
    }
    return data ? transformFromDB(data) : null;
  },

  // Add new recipe
  async add(recipe: Omit<Recipe, "id">): Promise<string> {
    const id = `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dbRecipe = transformToDB({ ...recipe, id });

    if (!isSupabaseEnabled || !supabase) {
      console.warn("[supabaseRecipes] Supabase not enabled, recipe saved to local only");
      return id; // Just return ID if Supabase not enabled
    }

    console.log("[supabaseRecipes] Adding recipe to Supabase:", id);
    const { data, error, status } = await supabase.from("recipes").insert([dbRecipe]).select();

    if (error) {
      console.error("[supabaseRecipes] Error adding recipe to Supabase:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        status,
      });
      // Don't throw - still add locally even if Supabase fails
      console.warn("[supabaseRecipes] Recipe will be saved locally only");
      return id;
    }

    if (!data || data.length === 0) {
      console.warn("[supabaseRecipes] Recipe insert returned no data, but no error. Status:", status);
    } else {
      console.log("[supabaseRecipes] Recipe added successfully to Supabase");
    }
    return id;
  },

  // Update recipe
  async update(id: string, recipe: Omit<Recipe, "id">): Promise<void> {
    if (!isSupabaseEnabled || !supabase) {
      console.warn("[supabaseRecipes] Supabase not enabled, recipe updated locally only");
      return; // Just return if Supabase not enabled
    }
    const dbRecipe = transformToDB({ ...recipe, id });

    console.log("[supabaseRecipes] Updating recipe in Supabase:", id);
    const { error } = await supabase
      .from("recipes")
      .update(dbRecipe)
      .eq("id", id);
    if (error) {
      console.error("[supabaseRecipes] Error updating recipe:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      console.warn("[supabaseRecipes] Recipe will be updated locally only");
      return;
    }
    console.log("[supabaseRecipes] Recipe updated successfully in Supabase:", id);
  },

  // Delete recipe
  async delete(id: string): Promise<void> {
    if (!isSupabaseEnabled || !supabase) {
      console.warn("[supabaseRecipes] Supabase not enabled, recipe deleted locally only");
      return; // Just return if Supabase not enabled
    }
    console.log("[supabaseRecipes] Deleting recipe from Supabase:", id);
    const { error } = await supabase.from("recipes").delete().eq("id", id);
    if (error) {
      console.error("[supabaseRecipes] Error deleting recipe:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });
      console.warn("[supabaseRecipes] Recipe will be deleted locally only");
      return;
    }
    console.log("[supabaseRecipes] Recipe deleted successfully from Supabase:", id);
  },

  // Upload image to storage
  async uploadImage(file: File, recipeId: string): Promise<string> {
    if (!isSupabaseEnabled || !supabase) {
      return ""; // Return empty string if Supabase not enabled
    }
    const filename = `${recipeId}_${Date.now()}`;
    const { data, error } = await supabase.storage
      .from("recipe-images")
      .upload(filename, file, { upsert: true });

    if (error) {
      console.error("Error uploading image:", error);
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from("recipe-images")
      .getPublicUrl(filename);

    return urlData.publicUrl;
  },

  // Delete image from storage
  async deleteImage(recipeId: string): Promise<void> {
    if (!isSupabaseEnabled || !supabase) {
      return; // Just return if Supabase not enabled
    }
    const { data: files } = await supabase.storage
      .from("recipe-images")
      .list(undefined, { search: recipeId });

    if (files && files.length > 0) {
      const { error } = await supabase.storage
        .from("recipe-images")
        .remove([`${files[0].name}`]);
      if (error) console.error("Error deleting image:", error);
    }
  },
};

// Helper functions to transform between app format and database format
function transformToDB(recipe: Recipe) {
  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    rating_average: recipe.rating.average,
    rating_count: recipe.rating.count,
    prep_minutes: recipe.cookTime.prepMinutes,
    cook_minutes: recipe.cookTime.cookMinutes,
    total_minutes: recipe.cookTime.totalMinutes,
    protein_tags: recipe.tags.protein,
    vegetables_tags: recipe.tags.vegetables,
    cuisine_tags: recipe.tags.cuisine,
    meal_type_tags: recipe.tags.mealType,
    method_tags: recipe.tags.method,
    ingredients: recipe.ingredients,
    procedure: recipe.procedure,
    media: recipe.media || { images: [] },
  };
}

interface DBRecipe {
  id: string;
  name: string;
  description: string;
  rating_average: number;
  rating_count: number;
  prep_minutes: number;
  cook_minutes: number;
  total_minutes: number;
  protein_tags: string[];
  vegetables_tags: string[];
  cuisine_tags: string[];
  meal_type_tags: string[];
  method_tags: string[];
  ingredients: Recipe["ingredients"];
  procedure: Recipe["procedure"];
  media?: Recipe["media"];
}

function transformFromDB(dbRecipe: DBRecipe): Recipe {
  return {
    id: dbRecipe.id,
    name: dbRecipe.name,
    description: dbRecipe.description,
    rating: {
      average: dbRecipe.rating_average,
      count: dbRecipe.rating_count,
    },
    cookTime: {
      prepMinutes: dbRecipe.prep_minutes,
      cookMinutes: dbRecipe.cook_minutes,
      totalMinutes: dbRecipe.total_minutes,
    },
    ingredients: dbRecipe.ingredients,
    procedure: dbRecipe.procedure,
    tags: {
      protein: dbRecipe.protein_tags || [],
      vegetables: dbRecipe.vegetables_tags || [],
      cuisine: dbRecipe.cuisine_tags || [],
      mealType: dbRecipe.meal_type_tags || [],
      method: dbRecipe.method_tags || [],
    },
    media: dbRecipe.media,
  };
}
