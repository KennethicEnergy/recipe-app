import Link from "next/link";
import { initialRecipes } from "@/data/recipes";

export default function HomePage() {
  const recipeCount = initialRecipes.length;

  return (
    <main className="p-10 text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-5xl font-bold">
          🍽 Recipe App
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover delicious recipes from around the world. Search by ingredients, filter by cuisine, and find your next favorite dish!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href="/recipes"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Browse All Recipes
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="p-6 border rounded-lg">
          <div className="text-3xl mb-2">🔍</div>
          <h3 className="font-semibold mb-2">Search & Filter</h3>
          <p className="text-sm text-gray-600">
            Find recipes by name, ingredients, or use advanced filters
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl mb-2">📚</div>
          <h3 className="font-semibold mb-2">Recipe Collection</h3>
          <p className="text-sm text-gray-600">
            {recipeCount} recipes with detailed instructions and ingredients
          </p>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl mb-2">⭐</div>
          <h3 className="font-semibold mb-2">Ratings & Reviews</h3>
          <p className="text-sm text-gray-600">
            See ratings and reviews from other home cooks
          </p>
        </div>
      </div>
    </main>
  );
}
