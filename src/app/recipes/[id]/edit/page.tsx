"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RecipeForm from "../../../../components/RecipeForm";
import { useRecipes } from "../../../../context/RecipeContext";
import { Recipe } from "../../../../types/recipe";
import { notFound } from "next/navigation";

export default function EditRecipePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const router = useRouter();
  const { getRecipeById, updateRecipe } = useRecipes();
  const [isLoading, setIsLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [resolvedId, setResolvedId] = useState<string>("");

  useEffect(() => {
    async function resolveParams() {
      const resolved = params instanceof Promise ? await params : params;
      setResolvedId(resolved.id);
      const found = getRecipeById(resolved.id);
      if (!found) {
        notFound();
      }
      setRecipe(found);
    }
    resolveParams();
  }, [params, getRecipeById]);

  const handleSubmit = async (updatedRecipe: Recipe) => {
    setIsLoading(true);
    try {
      const success = await updateRecipe(resolvedId, updatedRecipe);
      if (success) {
        router.push(`/recipes/${resolvedId}`);
      } else {
        throw new Error("Failed to update recipe");
      }
    } catch (error) {
      console.error("Failed to update recipe:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  if (!recipe) {
    return (
      <main className="min-h-screen bg-gray-900 text-yellow-400 p-6 md:p-10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border border-yellow-500 border-t-yellow-300 mx-auto"></div>
          <p className="mt-4">Loading recipe...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-yellow-400 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/recipes/${resolvedId}`}
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
            Back to Recipe
          </Link>
          <h1
            className="text-4xl font-bold text-yellow-400"
            style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}
          >
            Edit Recipe
          </h1>
        </div>

        <RecipeForm
          initialRecipe={recipe}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </main>
  );
}
