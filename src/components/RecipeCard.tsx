import Link from "next/link";
import { Recipe } from "@/types/recipe";
import { getTagColor } from "@/lib";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const displayTags = [
    ...recipe.tags.protein.slice(0, 1).map((t) => ({ tag: t, category: "protein" })),
    ...recipe.tags.cuisine.slice(0, 1).map((t) => ({ tag: t, category: "cuisine" })),
    ...recipe.tags.method.slice(0, 1).map((t) => ({ tag: t, category: "method" })),
  ];

  return (
    <Link href={`/recipes/${recipe.id}`}>
      <div className="border-2 border-yellow-500 rounded-lg p-4 space-y-3 hover:border-yellow-400 hover:bg-gray-800/50 transition-all cursor-pointer h-full bg-gray-900">
        <h3 className="text-xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          {recipe.name}
        </h3>

        <div className="flex items-center gap-4 text-yellow-400 text-sm">
          <div className="flex items-center gap-1">
            <span>⭐</span>
            <span>{recipe.rating.average}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⏱</span>
            <span>{recipe.cookTime.totalMinutes} mins</span>
          </div>
        </div>

        <p className="text-sm text-yellow-300 line-clamp-2">
          {recipe.description}
        </p>

        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTags.map(({ tag, category }, index) => (
              <span
                key={`${tag}-${index}`}
                className={`text-xs px-2 py-1 rounded border ${getTagColor(tag, category)} bg-transparent capitalize`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}