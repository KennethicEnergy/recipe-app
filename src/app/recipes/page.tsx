"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { initialRecipes } from "@/data/recipes";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import Link from "next/link";
import { findTagCategory } from "@/lib/findTagCategory";

export default function RecipesPage() {
  const recipes = initialRecipes;
	const searchParams = useSearchParams();
	const tagParam = searchParams.get("tag");

	const [searchQuery, setSearchQuery] = useState("");

	const emptyFilters = {
		protein: [] as string[],
		vegetables: [] as string[],
		cuisine: [] as string[],
		mealType: [] as string[],
		method: [] as string[],
	};

	const [selectedFilters, setSelectedFilters] = useState(emptyFilters);

	// Derive effective filters from URL + UI state (avoid setState in effect / cascading renders)
	const effectiveFilters = useMemo(() => {
		const category = tagParam ? findTagCategory(tagParam) : null;
		if (!category || !tagParam) return selectedFilters;
		return {
			...selectedFilters,
			[category]: [tagParam.toLowerCase()],
		};
	}, [tagParam, selectedFilters]);

	const handleFilterChange = (category: string, value: string) => {
		setSelectedFilters((prev) => {
			const currentValues = prev[category as keyof typeof prev];
			const newValues = currentValues.includes(value)
				? currentValues.filter((v) => v !== value)
				: [...currentValues, value];
			return { ...prev, [category]: newValues };
		});
	};

	const filteredRecipes = useMemo(() => {
		return recipes.filter((recipe) => {
			const matchesSearch =
				searchQuery === "" ||
				recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				recipe.ingredients.some((ing) =>
					ing.name.toLowerCase().includes(searchQuery.toLowerCase())
				) ||
				recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

			const matchesProtein =
				effectiveFilters.protein.length === 0 ||
				recipe.tags.protein.some((p) =>
					effectiveFilters.protein.includes(p.toLowerCase())
				) ||
				recipe.ingredients.some(
					(ing) =>
						(ing.type === "meat" || ing.type === "seafood") &&
						effectiveFilters.protein.includes(ing.name.toLowerCase())
				);

			const matchesVegetables =
				effectiveFilters.vegetables.length === 0 ||
				recipe.tags.vegetables.some((v) =>
					effectiveFilters.vegetables.includes(v.toLowerCase())
				) ||
				recipe.ingredients.some(
					(ing) =>
						ing.type === "vegetable" &&
						effectiveFilters.vegetables.includes(ing.name.toLowerCase())
				);

			const matchesCuisine =
				effectiveFilters.cuisine.length === 0 ||
				recipe.tags.cuisine.some((c) =>
					effectiveFilters.cuisine.includes(c.toLowerCase())
				);

			const matchesMealType =
				effectiveFilters.mealType.length === 0 ||
				recipe.tags.mealType.some((m) =>
					effectiveFilters.mealType.includes(m.toLowerCase())
				);

			const matchesMethod =
				effectiveFilters.method.length === 0 ||
				recipe.tags.method.some((m) =>
					effectiveFilters.method.includes(m.toLowerCase())
				);

			return (
				matchesSearch &&
				matchesProtein &&
				matchesVegetables &&
				matchesCuisine &&
				matchesMealType &&
				matchesMethod
			);
		});
	}, [recipes, searchQuery, effectiveFilters]);

	return (
		<main className="p-6 md:p-10 bg-gray-900 min-h-screen">
			<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
				<h1 className="text-3xl font-bold text-yellow-400">
					<Link
						href="/"
						className="inline-flex items-center text-yellow-400 hover:text-yellow-300 mb-4 transition-colors">
						<svg
							className="w-6 h-6 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
					</Link>
					Recipes
				</h1>
				<Link
					href="/recipes/new"
					className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors">
					<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
					</svg>
					Add Recipe
				</Link>
			</div>

			<div className="mb-6">
				<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-1">
					<FilterPanel
						recipes={recipes}
						selectedFilters={effectiveFilters}
						onFilterChange={handleFilterChange}
					/>
				</div>

				<div className="lg:col-span-3">
					<div className="mb-4 text-yellow-400">
						{filteredRecipes.length === 0
							? "No recipes found. Try adjusting your search or filters."
							: `Showing ${filteredRecipes.length} recipe${
									filteredRecipes.length !== 1 ? "s" : ""
							  }`}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{filteredRecipes.map((recipe) => (
							<RecipeCard key={recipe.id} recipe={recipe} />
						))}
					</div>
				</div>
			</div>
		</main>
	);
}
