"use client";

import { useState, useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClickableTag from "@/components/ClickableTag";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useRecipes } from "@/context/RecipeContext";
import { Recipe } from "@/types/recipe";

export default function RecipeDetailPage({
	params,
}: {
	params: Promise<{ id: string }> | { id: string };
}) {
	const router = useRouter();
	const { getRecipeById, deleteRecipe } = useRecipes();
	const [recipe, setRecipe] = useState<Recipe | null>(null);
	const [resolvedId, setResolvedId] = useState<string>("");
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

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

	const handleDelete = async () => {
		if (!recipe) return;
		setIsDeleting(true);
		try {
			const success = await deleteRecipe(resolvedId);
			if (success) {
				router.push("/recipes");
			} else {
				throw new Error("Failed to delete recipe");
			}
		} catch (error) {
			console.error("Failed to delete recipe:", error);
			throw error;
		} finally {
			setIsDeleting(false);
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

	const allTags = [
		...recipe.tags.protein.map((t) => ({ tag: t, category: "protein" })),
		...recipe.tags.cuisine.map((t) => ({ tag: t, category: "cuisine" })),
		...recipe.tags.method.map((t) => ({ tag: t, category: "method" })),
	];

	return (
		<>
			<DeleteConfirmModal
				isOpen={isDeleteModalOpen}
				recipeName={recipe.name}
				onConfirm={handleDelete}
				onCancel={() => setIsDeleteModalOpen(false)}
				isLoading={isDeleting}
			/>
			<main className="min-h-screen bg-gray-900 text-yellow-400 p-6 md:p-10 flex items-center">
				<div className="max-w-7xl mx-auto w-full">
					<div className="grid lg:grid-cols-[2fr_1px_1fr] gap-4">
						<div className="space-y-8">
							<div>
								<div className="flex items-start justify-between mb-4">
									<Link
										href="/recipes"
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
									<div className="flex gap-2">
										<Link
											href={`/recipes/${resolvedId}/edit`}
											className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded transition-colors text-sm">
											Edit
										</Link>
										<button
											onClick={() => setIsDeleteModalOpen(true)}
											className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors text-sm">
											Delete
										</button>
									</div>
								</div>
								<h1
									className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4"
									style={{
										fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
									}}>
									{recipe.name}
								</h1>

							<div className="flex items-center gap-6 mb-4 text-yellow-400">
								<div className="flex items-center gap-2">
									<span className="text-2xl">⭐</span>
									<span className="text-lg">{recipe.rating.average}</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-xl">⏱</span>
									<span className="text-lg">
										{recipe.cookTime.totalMinutes} mins
									</span>
								</div>
							</div>

							{allTags.length > 0 && (
								<div className="mb-6">
									<div className="flex flex-wrap gap-2">
										<p className="text-yellow-400 font-semibold my-auto">Tags:</p>
										{allTags.map(({ tag, category }, index) => (
											<ClickableTag
												key={`${tag}-${index}`}
												tag={tag}
												category={category}
											/>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Ingredients Section */}
						<div>
							<h2
								className="text-2xl font-bold text-yellow-400 mb-4"
								style={{
									fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
								}}>
								Ingredients
							</h2>
							<div className="max-h-64 overflow-y-auto pr-2">
								<div className="grid grid-cols-2 gap-3">
									{recipe.ingredients.map((ingredient, index) => (
										<div key={index} className="text-yellow-300 text-sm">
											{ingredient.name}
											{ingredient.amount && (
												<span className="text-yellow-500 text-xs ml-1">
													({ingredient.amount})
												</span>
											)}
										</div>
									))}
								</div>
							</div>
						</div>

						{/* Procedure Section */}
						<div>
							<h2
								className="text-2xl font-bold text-yellow-400 mb-4"
								style={{
									fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
								}}>
								Procedure
							</h2>
							<div className="max-h-64 overflow-y-auto pr-2">
								<ul className="space-y-3">
									{recipe.procedure.map((step) => (
										<li key={step.step} className="flex gap-3 text-yellow-300">
											<span className="text-yellow-400">•</span>
											<span>{step.instruction}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>

					{/* Green Vertical Divider */}
					<div className="hidden lg:block w-px"></div>

					{/* Right Column - Media and Description */}
					<div className="space-y-6">
						<div className="sticky top-6">
							{/* Media Box */}
							<div className="border-2 border-yellow-500 rounded-lg p-4 sm:p-6 bg-gray-800/50 aspect-video flex items-center justify-center mb-6">
								{recipe.media?.images && recipe.media.images.length > 0 ? (
									<div className="relative w-full h-full">
										{recipe.media.images[0].startsWith("data:") ? (
											<>
												{/* eslint-disable-next-line @next/next/no-img-element */}
												<img
													src={recipe.media.images[0]}
													alt={recipe.name}
													className="w-full h-full object-cover rounded-lg"
												/>
											</>
										) : (
											<Image
												src={recipe.media.images[0]}
												alt={recipe.name}
												width={600}
												height={400}
												className="w-full h-full object-cover rounded-lg"
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
											/>
										)}
										{recipe.media.video && (
											<div className="absolute inset-0 flex items-center justify-center">
												<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-400 transition-colors z-10">
													<svg
														className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900 ml-1"
														fill="currentColor"
														viewBox="0 0 24 24">
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</div>
										)}
									</div>
								) : (
									<div className="text-center text-yellow-400/50 w-full h-full flex flex-col items-center justify-center">
										<div className="text-4xl sm:text-6xl mb-4">🍽️</div>
										<p className="text-sm">Recipe Image</p>
										{recipe.media?.video && (
											<div className="mt-4">
												<div className="w-12 h-12 sm:w-16 sm:h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto cursor-pointer hover:bg-yellow-400 transition-colors">
													<svg
														className="w-6 h-6 sm:w-8 sm:h-8 text-gray-900 ml-1"
														fill="currentColor"
														viewBox="0 0 24 24">
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</div>
										)}
									</div>
								)}
							</div>

							{/* Description Box */}
							{recipe.description && (
								<div className="p-4">
									<p className="text-yellow-300 text-sm italic">
										{recipe.description}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
		</>
	);
}
