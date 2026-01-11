"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Recipe } from "@/types/recipe";
import { initialRecipes } from "@/data/recipes";

type RecipeContextType = {
  recipes: Recipe[];
  addRecipe: (recipe: Omit<Recipe, "id">) => string;
  updateRecipe: (id: string, recipe: Recipe) => boolean;
  deleteRecipe: (id: string) => boolean;
  getRecipeById: (id: string) => Recipe | undefined;
};

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: React.ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load recipes from localStorage on mount
  useEffect(() => {
    const loadRecipes = () => {
      const stored = localStorage.getItem("recipes");
      if (stored) {
        try {
          setRecipes(JSON.parse(stored));
        } catch {
          // Fallback to initial recipes if parse fails
          setRecipes(initialRecipes);
        }
      } else {
        setRecipes(initialRecipes);
      }
      setIsHydrated(true);
    };
    loadRecipes();
  }, []);

  // Persist recipes to localStorage whenever they change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("recipes", JSON.stringify(recipes));
    }
  }, [recipes, isHydrated]);

  const addRecipe = useCallback(
    (recipe: Omit<Recipe, "id">): string => {
      const newId = String(Math.max(0, ...recipes.map((r) => parseInt(r.id))) + 1);
      const newRecipe: Recipe = { ...recipe, id: newId };
      setRecipes((prev) => [...prev, newRecipe]);
      return newId;
    },
    [recipes]
  );

  const updateRecipe = useCallback(
    (id: string, updatedRecipe: Recipe): boolean => {
      const exists = recipes.some((r) => r.id === id);
      if (exists) {
        setRecipes((prev) =>
          prev.map((r) => (r.id === id ? updatedRecipe : r))
        );
        return true;
      }
      return false;
    },
    [recipes]
  );

  const deleteRecipe = useCallback(
    (id: string): boolean => {
      const exists = recipes.some((r) => r.id === id);
      if (exists) {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
        return true;
      }
      return false;
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
      value={{ recipes, addRecipe, updateRecipe, deleteRecipe, getRecipeById }}
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
