"use client";

import { RecipeProvider } from "../context/RecipeContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <RecipeProvider>{children}</RecipeProvider>;
}
