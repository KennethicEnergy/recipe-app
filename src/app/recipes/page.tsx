"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import Link from "next/link";
import { findTagCategory } from "@/lib/findTagCategory";
import { useRecipes } from "@/context/RecipeContext";

export default function RecipesPage() {
	const searchParams = useSearchParams();
	const tagParam = searchParams.get("tag");
	const { recipes } = useRecipes();

	const [searchQuery, setSearchQuery] = useState("");

	// Initialize filters from URL parameter
	const [selectedFilters, setSelectedFilters] = useState(() => {
		const filters = {
			protein: [] as string[],
			vegetables: [] as string[],
			cuisine: [] as string[],
			mealType: [] as string[],
			method: [] as string[],
		};

		if (tagParam) {
			const category = findTagCategory(tagParam);
			if (category) {
				filters[category as keyof typeof filters] = [tagParam.toLowerCase()];
			}
		}

		return filters;
	});

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
				selectedFilters.protein.length === 0 ||
				recipe.tags.protein.some((p) =>
					selectedFilters.protein.includes(p.toLowerCase())
				) ||
				recipe.ingredients.some(
					(ing) =>
						(ing.type === "meat" || ing.type === "seafood") &&
						selectedFilters.protein.includes(ing.name.toLowerCase())
				);

			const matchesVegetables =
				selectedFilters.vegetables.length === 0 ||
				recipe.tags.vegetables.some((v) =>
					selectedFilters.vegetables.includes(v.toLowerCase())
				) ||
				recipe.ingredients.some(
					(ing) =>
						ing.type === "vegetable" &&
						selectedFilters.vegetables.includes(ing.name.toLowerCase())
				);

			const matchesCuisine =
				selectedFilters.cuisine.length === 0 ||
				recipe.tags.cuisine.some((c) =>
					selectedFilters.cuisine.includes(c.toLowerCase())
				);

			const matchesMealType =
				selectedFilters.mealType.length === 0 ||
				recipe.tags.mealType.some((m) =>
					selectedFilters.mealType.includes(m.toLowerCase())
				);

			const matchesMethod =
				selectedFilters.method.length === 0 ||
				recipe.tags.method.some((m) =>
					selectedFilters.method.includes(m.toLowerCase())
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
	}, [searchQuery, selectedFilters, recipes]);

	return (
		<main className="p-6 md:p-10 bg-gray-900 min-h-screen">
			<div className="flex items-center justify-between mb-6">
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
					className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded transition-colors">
					+ New Recipe
				</Link>
			</div>

			<div className="mb-6">
				<SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
				<div className="lg:col-span-1">
					<FilterPanel
						recipes={recipes}
						selectedFilters={selectedFilters}
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
