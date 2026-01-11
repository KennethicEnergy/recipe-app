"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RecipeForm from "@/components/RecipeForm";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";

export default function NewRecipePage() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (recipe: Recipe) => {
    setIsLoading(true);
    try {
      const newId = addRecipe(recipe);
      router.push(`/recipes/${newId}`);
    } catch (error) {
      console.error("Failed to add recipe:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-yellow-400 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/recipes"
            className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Recipes
          </Link>
          <h1
            className="text-4xl font-bold text-yellow-400"
            style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}
          >
            Create New Recipe
          </h1>
        </div>

        <RecipeForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </main>
  );
}
