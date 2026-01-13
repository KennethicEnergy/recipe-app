"use client";

import { useState } from "react";
import { Recipe } from "../types/recipe";

type RecipeFormProps = {
  initialRecipe?: Recipe;
  onSubmit: (recipe: Recipe) => Promise<void>;
  isLoading?: boolean;
};

export default function RecipeForm({
  initialRecipe,
  onSubmit,
  isLoading = false,
}: RecipeFormProps) {
  const [recipe, setRecipe] = useState<Recipe>(
    initialRecipe || {
      id: "",
      name: "",
      description: "",
      rating: { average: 0, count: 0 },
      cookTime: { prepMinutes: 0, cookMinutes: 0, totalMinutes: 0 },
      ingredients: [],
      procedure: [],
      tags: {
        protein: [],
        vegetables: [],
        cuisine: [],
        mealType: [],
        method: [],
      },
    }
  );

  const [error, setError] = useState<string>("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecipe((prev) => ({ ...prev, name: e.target.value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRecipe((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleCookTimeChange = (
    field: "prepMinutes" | "cookMinutes" | "totalMinutes",
    value: number
  ) => {
    setRecipe((prev) => ({
      ...prev,
      cookTime: { ...prev.cookTime, [field]: value },
    }));
  };

  const handleRatingChange = (field: "average" | "count", value: number) => {
    setRecipe((prev) => ({
      ...prev,
      rating: { ...prev.rating, [field]: value },
    }));
  };

  const handleAddIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { name: "", type: "other", amount: "" },
      ],
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: "name" | "type" | "amount",
    value: string
  ) => {
    setRecipe((prev) => {
      const newIngredients = [...prev.ingredients];
      // Lowercase and trim the ingredient name
      const processedValue = field === "name" ? value.toLowerCase().trim() : value.trim();
      newIngredients[index] = {
        ...newIngredients[index],
        [field]: processedValue,
      };
      return { ...prev, ingredients: newIngredients };
    });
  };

  const handleRemoveIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const handleAddProcedureStep = () => {
    const nextStep = Math.max(0, ...recipe.procedure.map((p) => p.step)) + 1;
    setRecipe((prev) => ({
      ...prev,
      procedure: [...prev.procedure, { step: nextStep, instruction: "" }],
    }));
  };

  const handleProcedureChange = (index: number, instruction: string) => {
    setRecipe((prev) => {
      const newProcedure = [...prev.procedure];
      // Lowercase and trim the procedure instruction
      newProcedure[index] = { ...newProcedure[index], instruction: instruction.toLowerCase().trim() };
      return { ...prev, procedure: newProcedure };
    });
  };

  const handleRemoveProcedureStep = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      procedure: prev.procedure.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setRecipe((prev) => ({
          ...prev,
          media: {
            ...prev.media,
            images: [base64],
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setRecipe((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        images: [],
      },
    }));
  };

  const validateForm = (): boolean => {
    if (!recipe.name.trim()) {
      setError("Recipe name is required");
      return false;
    }
    if (!recipe.description.trim()) {
      setError("Recipe description is required");
      return false;
    }
    if (recipe.ingredients.length === 0) {
      setError("At least one ingredient is required");
      return false;
    }
    if (recipe.procedure.length === 0) {
      setError("At least one procedure step is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(recipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save recipe");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500 rounded text-red-300">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Basic Information
        </h2>

        <div>
          <label className="block text-yellow-300 mb-2">Recipe Name *</label>
          <input
            type="text"
            value={recipe.name}
            onChange={handleNameChange}
            className="w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 placeholder-yellow-600 focus:outline-none focus:border-yellow-300"
            placeholder="Enter recipe name"
          />
        </div>

        <div>
          <label className="block text-yellow-300 mb-2">Description *</label>
          <textarea
            value={recipe.description}
            onChange={handleDescriptionChange}
            className="w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 placeholder-yellow-600 focus:outline-none focus:border-yellow-300 resize-vertical"
            placeholder="Enter recipe description"
            rows={4}
          />
        </div>
      </div>

      {/* Recipe Image */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Recipe Image
        </h2>

        {recipe.media?.images && recipe.media.images.length > 0 ? (
          <div className="space-y-3">
            <div className="relative w-full max-w-xs mx-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={recipe.media.images[0]}
                alt="Recipe preview"
                className="w-full h-48 object-cover rounded border-2 border-yellow-500"
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
            >
              Remove Image
            </button>
          </div>
        ) : (
          <div>
            <label className="block text-yellow-300 mb-2">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 focus:outline-none focus:border-yellow-300 cursor-pointer"
            />
            <p className="text-yellow-500 text-xs mt-2">Supported formats: JPG, PNG, GIF, WebP (Max 5MB)</p>
          </div>
        )}
      </div>

      {/* Cooking Times */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Cooking Times
        </h2>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Prep Time (mins)", field: "prepMinutes" },
            { label: "Cook Time (mins)", field: "cookMinutes" },
            { label: "Total Time (mins)", field: "totalMinutes" },
          ].map(({ label, field }) => (
            <div key={field}>
              <label className="block text-yellow-300 mb-2">{label}</label>
              <input
                type="number"
                value={recipe.cookTime[field as keyof typeof recipe.cookTime]}
                onChange={(e) =>
                  handleCookTimeChange(
                    field as "prepMinutes" | "cookMinutes" | "totalMinutes",
                    parseInt(e.target.value) || 0
                  )
                }
                className="w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 focus:outline-none focus:border-yellow-300"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Rating
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-yellow-300 mb-2">Average Rating</label>
            <input
              type="number"
              value={recipe.rating.average}
              onChange={(e) => handleRatingChange("average", parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 focus:outline-none focus:border-yellow-300"
              min="0"
              max="5"
              step="0.1"
            />
          </div>
          <div>
            <label className="block text-yellow-300 mb-2">Number of Ratings</label>
            <input
              type="number"
              value={recipe.rating.count}
              onChange={(e) => handleRatingChange("count", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 focus:outline-none focus:border-yellow-300"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Ingredients *
        </h2>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 placeholder-yellow-600 focus:outline-none focus:border-yellow-300 text-sm"
                  placeholder="Ingredient name"
                />
              </div>
              <select
                value={ingredient.type}
                onChange={(e) =>
                  handleIngredientChange(
                    index,
                    "type",
                    e.target.value as "meat" | "vegetable" | "seafood" | "other"
                  )
                }
                className="px-3 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 focus:outline-none focus:border-yellow-300 text-sm"
              >
                <option value="other">Other</option>
                <option value="meat">Meat</option>
                <option value="vegetable">Vegetable</option>
                <option value="seafood">Seafood</option>
              </select>
              <input
                type="text"
                value={ingredient.amount || ""}
                onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 placeholder-yellow-600 focus:outline-none focus:border-yellow-300 text-sm w-24"
                placeholder="Amount"
              />
              <button
                type="button"
                onClick={() => handleRemoveIngredient(index)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddIngredient}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded transition-colors"
        >
          Add Ingredient
        </button>
      </div>

      {/* Procedure */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Procedure *
        </h2>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {recipe.procedure.map((step, index) => (
            <div key={index} className="flex gap-3 items-start">
              <span className="text-yellow-400 font-semibold min-w-8 mt-2">
                {index + 1}.
              </span>
              <textarea
                value={step.instruction}
                onChange={(e) => handleProcedureChange(index, e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 placeholder-yellow-600 focus:outline-none focus:border-yellow-300 text-sm resize-none"
                placeholder="Step instruction"
                rows={2}
              />
              <button
                type="button"
                onClick={() => handleRemoveProcedureStep(index)}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddProcedureStep}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded transition-colors"
        >
          Add Step
        </button>
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-yellow-400" style={{ fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive" }}>
          Tags
        </h2>

        {[
          { label: "Protein", key: "protein" },
          { label: "Vegetables", key: "vegetables" },
          { label: "Cuisine", key: "cuisine" },
          { label: "Meal Type", key: "mealType" },
          { label: "Method", key: "method" },
        ].map(({ label, key }) => (
          <div key={key}>
            <label className="block text-yellow-300 mb-2">{label}</label>
            <input
              type="text"
              placeholder={`Enter ${label.toLowerCase()} separated by commas`}
              onChange={(e) => {
                const tags = e.target.value
                  .split(",")
                  .map((t) => t.trim().toLowerCase())
                  .filter((t) => t.length > 0);
                setRecipe((prev) => ({
                  ...prev,
                  tags: { ...prev.tags, [key]: tags },
                }));
              }}
              value={recipe.tags[key as keyof typeof recipe.tags].join(", ")}
              className="w-full px-4 py-2 bg-gray-800 border border-yellow-500 rounded text-yellow-400 placeholder-yellow-600 focus:outline-none focus:border-yellow-300"
            />
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-semibold rounded transition-colors"
        >
          {isLoading ? "Saving..." : "Save Recipe"}
        </button>
      </div>
    </form>
  );
}
