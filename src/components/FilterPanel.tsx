"use client";

import { useState } from "react";
import { Recipe } from "../types/recipe";

type FilterPanelProps = {
  recipes: Recipe[];
  selectedFilters: {
    protein: string[];
    vegetables: string[];
    cuisine: string[];
    mealType: string[];
    method: string[];
  };
  onFilterChange: (category: string, value: string) => void;
};

type FilterSectionProps = {
  title: string;
  values: string[];
  category: string;
  selectedFilters: FilterPanelProps["selectedFilters"];
  onFilterChange: (category: string, value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
};

function FilterSection({
  title,
  values,
  category,
  selectedFilters,
  onFilterChange,
  isOpen,
  onToggle,
}: FilterSectionProps) {
  if (values.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between font-semibold mb-2 text-yellow-400 hover:text-yellow-300 transition-colors sm:pointer-events-none"
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform sm:hidden ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 ${
          isOpen ? "block" : "hidden sm:grid"
        }`}
      >
        {values.map((value) => (
          <label key={value} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedFilters[category as keyof typeof selectedFilters].includes(value)}
              onChange={() => onFilterChange(category, value)}
              className="w-4 h-4 text-yellow-500 bg-gray-700 border-yellow-500 rounded focus:ring-yellow-500 focus:ring-2"
            />
            <span className="text-sm text-yellow-300 capitalize">{value}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FilterPanel({
  recipes,
  selectedFilters,
  onFilterChange,
}: FilterPanelProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    protein: false,
    vegetables: false,
    cuisine: false,
    mealType: false,
    method: false,
  });

  const toggleSection = (category: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const getAllUniqueValues = (key: keyof Recipe["tags"]) => {
    const allValues = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.tags[key].forEach((value) => allValues.add(value));
    });
    return Array.from(allValues).sort();
  };

  const getAllUniqueIngredients = (type: "meat" | "vegetable" | "seafood" | "other") => {
    const allValues = new Set<string>();
    recipes.forEach((recipe) => {
      recipe.ingredients
        .filter((ing) => ing.type === type)
        .forEach((ing) => allValues.add(ing.name));
    });
    return Array.from(allValues).sort();
  };

  return (
    <div className="bg-gray-800 border-2 border-yellow-500 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-yellow-400">Filters</h2>
      <FilterSection
        title="Protein"
        values={getAllUniqueIngredients("meat").concat(getAllUniqueIngredients("seafood"))}
        category="protein"
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        isOpen={openSections.protein}
        onToggle={() => toggleSection("protein")}
      />

      <FilterSection
        title="Vegetables"
        values={getAllUniqueIngredients("vegetable")}
        category="vegetables"
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        isOpen={openSections.vegetables}
        onToggle={() => toggleSection("vegetables")}
      />

      <FilterSection
        title="Cuisine"
        values={getAllUniqueValues("cuisine")}
        category="cuisine"
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        isOpen={openSections.cuisine}
        onToggle={() => toggleSection("cuisine")}
      />

      <FilterSection
        title="Meal Type"
        values={getAllUniqueValues("mealType")}
        category="mealType"
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        isOpen={openSections.mealType}
        onToggle={() => toggleSection("mealType")}
      />

      <FilterSection
        title="Cooking Method"
        values={getAllUniqueValues("method")}
        category="method"
        selectedFilters={selectedFilters}
        onFilterChange={onFilterChange}
        isOpen={openSections.method}
        onToggle={() => toggleSection("method")}
      />
    </div>
  );
}

