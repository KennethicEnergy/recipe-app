"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe } from "@/types/recipe";
import { initialRecipes } from "@/data/recipes";
import { supabaseRecipes } from "@/lib/supabaseRecipes";

type RecipeContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "id">) => Promise<string>;
  updateRecipe: (id: string, recipe: Recipe) => Promise<boolean>;
  deleteRecipe: (id: string) => Promise<boolean>;
  getRecipeById: (id: string) => Recipe | undefined;
  isLoading: boolean;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load recipes from Supabase or localStorage on mount
  useEffect(() => {
    const loadRecipes = async () => {
      setIsLoading(true);
      try {
        // Try to load from Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        console.log("[RecipeContext] Supabase URL configured:", supabaseUrl ? "yes" : "no");

        if (supabaseUrl) {
          console.log("[RecipeContext] Attempting to fetch recipes from Supabase...");
          const fetchedRecipes = await supabaseRecipes.getAll();
          console.log("[RecipeContext] Fetched from Supabase:", fetchedRecipes.length, "recipes");

          // Use Supabase recipes if available, otherwise fall back to localStorage
          if (fetchedRecipes.length > 0) {
            setRecipes(fetchedRecipes);
            // Cache in localStorage
            localStorage.setItem("recipes", JSON.stringify(fetchedRecipes));
            setIsHydrated(true);
            setIsLoading(false);
            return;
          } else {
            console.log("[RecipeContext] Supabase returned empty, checking localStorage...");
          }
        }
      } catch (error) {
        console.error("[RecipeContext] Failed to load from Supabase, falling back to localStorage:", error);
      }

      // Fallback to localStorage
      try {
        const stored = localStorage.getItem("recipes");
        if (stored) {
          console.log("[RecipeContext] Loading recipes from localStorage");
          setRecipes(JSON.parse(stored));
        } else {
          console.log("[RecipeContext] No localStorage data, using initial recipes");
          setRecipes(initialRecipes);
          localStorage.setItem("recipes", JSON.stringify(initialRecipes));
        }
      } catch {
        setRecipes(initialRecipes);
      }
      setIsHydrated(true);
      setIsLoading(false);
    };

    loadRecipes();
  }, []);

  // Persist recipes to localStorage as cache
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
  }, [recipes, isHydrated]);

  const addRecipe = useCallback(
    async (recipe: Omit<Recipe, "id">): Promise<string> => {
      setIsLoading(true);
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        let newId: string;

        if (supabaseUrl) {
          // Save to Supabase
          newId = await supabaseRecipes.add(recipe);
        } else {
          // Fallback to localStorage
          newId = `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        }

        const newRecipe: Recipe = { ...recipe, id: newId };
        setRecipes((prev) => [...prev, newRecipe]);
        return newId;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateRecipe = useCallback(
    async (id: string, updatedRecipe: Recipe): Promise<boolean> => {
      setIsLoading(true);
      try {
        const exists = recipes.some((r) => r.id === id);
        if (!exists) return false;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
          // Update in Supabase
          await supabaseRecipes.update(id, updatedRecipe);
        }

        setRecipes((prev) =>
          prev.map((r) => (r.id === id ? updatedRecipe : r))
        );
        return true;
      } finally {
        setIsLoading(false);
      }
    },
    [recipes]
  );

  const deleteRecipe = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        const exists = recipes.some((r) => r.id === id);
        if (!exists) return false;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (supabaseUrl) {
          // Delete from Supabase
          await supabaseRecipes.delete(id);
        }

        setRecipes((prev) => prev.filter((r) => r.id !== id));
        return true;
      } finally {
        setIsLoading(false);
      }
    },
    [recipes]
  );

  const getRecipeById = useCallback(
    (id: string): Recipe | undefined => {
      return recipes.find((r) => r.id === id);
    },
    [recipes]
  );

  // Only render children after hydration to avoid hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <RecipeContext.Provider
      value={{ recipes, addRecipe, updateRecipe, deleteRecipe, getRecipeById, isLoading }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within RecipeProvider");
  }
  return context;
}
