# AI Coding Instructions for Recipe App

## Project Overview
This is a Next.js 16 recipe browsing application styled with Tailwind CSS and TypeScript. The app features a recipe collection with advanced filtering, search, and detailed recipe pages. Key tech stack: React 19, Next.js 16, Tailwind CSS 4, TypeScript 5.

## Data Management & State

### Recipe State Management (`src/context/RecipeContext.tsx`)
Uses React Context with localStorage persistence for CRUD operations:
- **`RecipeProvider`**: Wraps app in `src/app/layout.tsx`, manages recipe state with hydration check
- **`useRecipes()`**: Hook for accessing recipes and mutation functions
- **Core operations**:
  - `addRecipe(recipe)` → generates ID, returns new ID
  - `updateRecipe(id, recipe)` → modifies existing recipe
  - `deleteRecipe(id)` → removes recipe
  - `getRecipeById(id)` → retrieves single recipe
- **Persistence**: Recipes automatically sync to localStorage on change; restored on mount
- **Hydration**: Page returns null until localStorage loaded (prevents hydration mismatch)

### Data & Routes
All recipes follow the `Recipe` type with these key properties:
- `id`, `name`, `description`: Basic metadata
- `rating`: `{ average: number, count: number }`
- `cookTime`: `{ prepMinutes, cookMinutes, totalMinutes }`
- `ingredients`: Array with `type` field (`"meat"` | `"vegetable"` | `"seafood"` | `"other"`)
- `tags`: Organized by category (protein, vegetables, cuisine, mealType, method)
- `procedure`: Step-by-step instructions with step number and instruction text
- `media`: Optional object with `images` array (stores base64-encoded image data URLs)

### Data & Routes
- `src/data/recipes.ts`: Initial recipe seed data (exported as `initialRecipes`)
- Routes follow Next.js App Router pattern:
  - `/` → Homepage with overview
  - `/recipes` → Filtered/searchable list with "+ New Recipe" button (client component)
  - `/recipes/new` → Create recipe form (client component with RecipeForm)
  - `/recipes/[id]` → Detail view with Edit/Delete buttons (client component)
  - `/recipes/[id]/edit` → Edit recipe form (client component with RecipeForm pre-populated)

## Component Architecture

### Filtering & Search Pattern (`src/app/recipes/page.tsx`)
The recipes page uses **client-side filtering** with `useMemo` for performance:
1. Multi-category filter state: protein, vegetables, cuisine, mealType, method
2. Search query against name, ingredients, description
3. Filters apply to both tags AND ingredient names (ingredient-based matching is important)
4. URL query params (`?tag=...`) initialize filters via `useSearchParams()` + `useEffect()`

### Components
- **`RecipeCard.tsx`**: Displays 1 recipe summary with 3 tags (protein + cuisine + method), uses `getTagColor()` for styling
- **`RecipeForm.tsx`**: Form component for creating/editing recipes with full field management:
  - Name, description, cooking times, rating
  - **Image upload**: File input with base64 encoding, stores in `recipe.media.images[0]`
  - Image preview when uploaded, can be removed before saving
  - Dynamic ingredient management with type selection (meat/vegetable/seafood/other)
  - Dynamic procedure steps with add/remove functionality
  - Tag management (protein, vegetables, cuisine, mealType, method)
  - Form validation with error display
- **`DeleteConfirmModal.tsx`**: Modal confirmation for recipe deletion with recipe name display
- **`FilterPanel.tsx`**: "Use client" component. Mobile-responsive collapsible sections, checkbox-based filtering
- **`SearchBar.tsx`**: Input component for search query
- **`ClickableTag.tsx`**: Tag component that navigates to `/recipes?tag=...` when clicked

### Tag System (`src/lib/`)
- **`getTagColor(tag, category)`**: Returns Tailwind classes for tag color coding:
  - protein → red-500
  - cuisine → green-500
  - method → orange-500
  - default → yellow-500
- **`findTagCategory(tag)`**: Scans all recipes to categorize a tag string. Used to hydrate filters from URL params.

## Styling Conventions
- **Dark theme**: Gray-900 background, yellow-400 primary text
- **Accents**: Yellow borders (yellow-500), color-coded tags
- **Font**: Comic Sans MS / Chalkboard SE (cursive) for headings in cards and titles
- **Responsive**: Mobile-first design using Tailwind's `sm:` breakpoints; FilterPanel has mobile collapsible sections

## Developer Workflows

### Running the App
```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm start        # Run production build
npm run lint     # Run ESLint
```

### Adding Recipes
1. Via UI: Navigate to `/recipes/new`, fill the form, submit to auto-redirect to detail page
2. Via code: Add to `src/data/recipes.ts` array (seed data only)
3. Follow `Recipe` type exactly; include all tag categories even if empty
4. Ingredient type matters: affects filtering and tag detection

### Adding Filter Categories
- Modify `selectedFilters` type in `src/app/recipes/page.tsx`
- Update `FilterPanel.tsx` to render new category
- Update `findTagCategory()` to recognize new tags
- Add color case to `getTagColor()` if desired

## Key Patterns & Conventions

### Client vs Server Components
- Pages without "use client" are default server components (e.g., detail page, homepage)
- Recipes list and FilterPanel are "use client" (state-driven interactivity)
- Server components use `async` params handling: `params: Promise<{ id: string }>`

### Dynamic Routes
- `/recipes/[id]` uses `export const dynamicParams = true` for dynamic rendering
- Params may arrive as Promise; normalize with: `const resolved = params instanceof Promise ? await params : params`
- Use `notFound()` from `next/navigation` for 404s

### State & URL Sync
- Recipes page syncs filter state to URL query params manually (no Next.js middleware)
- Tag param (`?tag=...`) auto-initializes filters on page load
- `useEffect` ensures URL param changes update state

## Important Details

### Ingredient-Based Filtering
Filtering logic checks both tags AND ingredient names:
```typescript
recipe.tags.protein.some(...) ||
recipe.ingredients.some(ing => ing.type === "meat|seafood" && selectedFilters.protein.includes(ing.name.toLowerCase()))
```
This means searching "chicken" finds recipes with chicken tag OR ingredient.

### Case Normalization
Tag matching is case-insensitive throughout (`.toLowerCase()`), but original case preserved for display.

### Rating Display
Recipes show `rating.average` (e.g., "4.6"), not count. Count used for logic only.

### Media & Image Handling
- **Image Storage**: Stores base64-encoded data URLs in `recipe.media.images[0]`
- **Upload Process**: Uses FileReader API in `RecipeForm` to convert files to base64
- **Display**: Recipe detail page checks if image starts with `"data:"` to use `<img>` for base64, otherwise uses Next.js `<Image>` component
- **Optional**: Images are optional; form can be saved without an image
- **Removal**: Users can remove uploaded image before saving and re-upload a different one

## Common Editing Tasks

- **New page**: Create file in `src/app/` following route structure
- **New utility**: Add to `src/lib/` and export from `src/lib/index.ts`
- **New type**: Add to `src/types/recipe.ts` or create new type file
- **Style changes**: Use Tailwind classes; avoid custom CSS (only `globals.css` imports Tailwind)
- **Component reuse**: Check `src/components/` before creating similar patterns

## Recipe Management Operations

### Adding a Recipe Programmatically
```typescript
const { addRecipe } = useRecipes();
const newId = addRecipe({
  name: "My Recipe",
  description: "...",
  // ... other Recipe fields (omit id)
});
// Auto-increments ID from existing recipes
```

### Editing a Recipe
1. Page route: `/recipes/[id]/edit`
2. Pre-fills RecipeForm with existing recipe data via `getRecipeById()`
3. Submit updates recipe and redirects back to detail page

### Deleting a Recipe
1. Delete button on `/recipes/[id]` detail page
2. Triggers DeleteConfirmModal with recipe name
3. On confirm, deletes and redirects to `/recipes`

### Form Validation
RecipeForm validates before submission:
- Recipe name and description required
- At least one ingredient required
- At least one procedure step required
- All other fields optional but type-safe
