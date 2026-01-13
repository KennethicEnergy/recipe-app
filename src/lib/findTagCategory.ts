import { initialRecipes } from "../data/recipes";

// Helper function to find tag category
export function findTagCategory(tag: string): string | null {
	const allProteins = new Set<string>();
	const allVegetables = new Set<string>();
	const allCuisines = new Set<string>();
	const allMethods = new Set<string>();

	initialRecipes.forEach((recipe) => {
		recipe.tags.protein.forEach((p) => allProteins.add(p.toLowerCase()));
		recipe.tags.vegetables.forEach((v) => allVegetables.add(v.toLowerCase()));
		recipe.tags.cuisine.forEach((c) => allCuisines.add(c.toLowerCase()));
		recipe.tags.method.forEach((m) => allMethods.add(m.toLowerCase()));

		// Also check ingredients
		recipe.ingredients.forEach((ing) => {
			if (ing.type === "meat" || ing.type === "seafood") {
				allProteins.add(ing.name.toLowerCase());
			} else if (ing.type === "vegetable") {
				allVegetables.add(ing.name.toLowerCase());
			}
		});
	});

	const normalizedTag = tag.toLowerCase();
	if (allProteins.has(normalizedTag)) return "protein";
	if (allVegetables.has(normalizedTag)) return "vegetables";
	if (allCuisines.has(normalizedTag)) return "cuisine";
	if (allMethods.has(normalizedTag)) return "method";
	return null;
}
