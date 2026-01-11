import type { Metadata } from "next";
import "./globals.css";
import { RecipeProvider } from "@/context/RecipeContext";

export const metadata: Metadata = {
  title: "Recipe App",
  description: "A collection of delicious recipes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RecipeProvider>{children}</RecipeProvider>
      </body>
    </html>
  );
}

