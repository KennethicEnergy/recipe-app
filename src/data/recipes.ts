import { Recipe } from "../types/recipe";

export const initialRecipes: Recipe[] = [
  {
    id: "1",
    name: "Chicken Hamonado",
    description: "Sweet Filipino-style chicken cooked with pineapple.",

    rating: {
      average: 4.6,
      count: 128
    },

    cookTime: {
      prepMinutes: 15,
      cookMinutes: 35,
      totalMinutes: 50
    },

    ingredients: [
      { name: "chicken", type: "meat", amount: "1 kg" },
      { name: "pineapple chunks", type: "other", amount: "1 cup" },
      { name: "soy sauce", type: "other", amount: "1/4 cup" },
      { name: "garlic", type: "vegetable", amount: "5 cloves" },
      { name: "onion", type: "vegetable", amount: "1 medium" }
    ],

    procedure: [
      { step: 1, instruction: "Sauté garlic and onion until fragrant." },
      { step: 2, instruction: "Add chicken and brown lightly." },
      { step: 3, instruction: "Add soy sauce and pineapple juice." },
      { step: 4, instruction: "Simmer for 25 minutes." },
      { step: 5, instruction: "Serve hot." }
    ],

    tags: {
      protein: ["chicken"],
      vegetables: ["garlic", "onion"],
      cuisine: ["filipino"],
      mealType: ["lunch", "dinner"],
      method: ["stew"]
    }
  },
  {
    id: "2",
    name: "Crab and Corn Soup",
    description: "Creamy soup with fresh crab meat and sweet corn kernels.",

    rating: {
      average: 4.8,
      count: 95
    },

    cookTime: {
      prepMinutes: 20,
      cookMinutes: 30,
      totalMinutes: 50
    },

    ingredients: [
      { name: "crab meat", type: "seafood", amount: "500g" },
      { name: "corn kernels", type: "vegetable", amount: "2 cups" },
      { name: "cream", type: "other", amount: "1 cup" },
      { name: "butter", type: "other", amount: "2 tbsp" },
      { name: "garlic", type: "vegetable", amount: "3 cloves" },
      { name: "onion", type: "vegetable", amount: "1 medium" }
    ],

    procedure: [
      { step: 1, instruction: "Sauté garlic and onion in butter." },
      { step: 2, instruction: "Add corn kernels and cook for 5 minutes." },
      { step: 3, instruction: "Add crab meat and stir." },
      { step: 4, instruction: "Pour in cream and simmer for 20 minutes." },
      { step: 5, instruction: "Season with salt and pepper. Serve hot." }
    ],

    tags: {
      protein: ["crab"],
      vegetables: ["corn", "garlic", "onion"],
      cuisine: ["filipino"],
      mealType: ["lunch", "dinner"],
      method: ["soup"]
    }
  },
  {
    id: "3",
    name: "Pork Adobo",
    description: "Classic Filipino dish with tender pork in savory soy-vinegar sauce.",

    rating: {
      average: 4.9,
      count: 256
    },

    cookTime: {
      prepMinutes: 10,
      cookMinutes: 45,
      totalMinutes: 55
    },

    ingredients: [
      { name: "pork", type: "meat", amount: "1 kg" },
      { name: "soy sauce", type: "other", amount: "1/2 cup" },
      { name: "vinegar", type: "other", amount: "1/4 cup" },
      { name: "garlic", type: "vegetable", amount: "8 cloves" },
      { name: "bay leaves", type: "other", amount: "3 pieces" },
      { name: "black peppercorns", type: "other", amount: "1 tsp" }
    ],

    procedure: [
      { step: 1, instruction: "Marinate pork in soy sauce and vinegar for 30 minutes." },
      { step: 2, instruction: "Sauté garlic until golden." },
      { step: 3, instruction: "Add pork and cook until browned." },
      { step: 4, instruction: "Add marinade, bay leaves, and peppercorns." },
      { step: 5, instruction: "Simmer for 40 minutes until tender." }
    ],

    tags: {
      protein: ["pork"],
      vegetables: ["garlic"],
      cuisine: ["filipino"],
      mealType: ["dinner"],
      method: ["stew"]
    }
  },
  {
    id: "4",
    name: "Eggplant Parmesan",
    description: "Baked eggplant layered with marinara sauce and melted cheese.",

    rating: {
      average: 4.7,
      count: 142
    },

    cookTime: {
      prepMinutes: 25,
      cookMinutes: 40,
      totalMinutes: 65
    },

    ingredients: [
      { name: "eggplant", type: "vegetable", amount: "2 large" },
      { name: "mozzarella cheese", type: "other", amount: "200g" },
      { name: "parmesan cheese", type: "other", amount: "100g" },
      { name: "marinara sauce", type: "other", amount: "2 cups" },
      { name: "breadcrumbs", type: "other", amount: "1 cup" },
      { name: "eggs", type: "other", amount: "2 pieces" }
    ],

    procedure: [
      { step: 1, instruction: "Slice eggplant and salt to remove bitterness." },
      { step: 2, instruction: "Dip in beaten eggs, then breadcrumbs." },
      { step: 3, instruction: "Fry until golden brown." },
      { step: 4, instruction: "Layer with sauce and cheeses in baking dish." },
      { step: 5, instruction: "Bake at 375°F for 30 minutes." }
    ],

    tags: {
      protein: [],
      vegetables: ["eggplant"],
      cuisine: ["italian"],
      mealType: ["lunch", "dinner"],
      method: ["baked"]
    }
  },
  {
    id: "5",
    name: "Beef Steak",
    description: "Tender beef slices in rich, savory sauce.",

    rating: {
      average: 4.5,
      count: 89
    },

    cookTime: {
      prepMinutes: 15,
      cookMinutes: 25,
      totalMinutes: 40
    },

    ingredients: [
      { name: "beef", type: "meat", amount: "500g" },
      { name: "soy sauce", type: "other", amount: "1/4 cup" },
      { name: "lemon juice", type: "other", amount: "2 tbsp" },
      { name: "onion", type: "vegetable", amount: "1 large" },
      { name: "garlic", type: "vegetable", amount: "4 cloves" }
    ],

    procedure: [
      { step: 1, instruction: "Marinate beef in soy sauce and lemon juice." },
      { step: 2, instruction: "Sauté garlic and onion." },
      { step: 3, instruction: "Add beef and cook until tender." },
      { step: 4, instruction: "Pour in marinade and simmer." },
      { step: 5, instruction: "Serve with rice." }
    ],

    tags: {
      protein: ["beef"],
      vegetables: ["onion", "garlic"],
      cuisine: ["filipino"],
      mealType: ["lunch", "dinner"],
      method: ["pan-fried"]
    }
  },
  {
    id: "6",
    name: "Grilled Salmon",
    description: "Fresh salmon fillet with herbs and lemon.",

    rating: {
      average: 4.9,
      count: 203
    },

    cookTime: {
      prepMinutes: 10,
      cookMinutes: 15,
      totalMinutes: 25
    },

    ingredients: [
      { name: "salmon", type: "seafood", amount: "4 fillets" },
      { name: "lemon", type: "other", amount: "2 pieces" },
      { name: "olive oil", type: "other", amount: "3 tbsp" },
      { name: "dill", type: "other", amount: "2 tbsp" },
      { name: "salt", type: "other", amount: "to taste" },
      { name: "pepper", type: "other", amount: "to taste" }
    ],

    procedure: [
      { step: 1, instruction: "Preheat grill to medium-high." },
      { step: 2, instruction: "Season salmon with salt, pepper, and dill." },
      { step: 3, instruction: "Brush with olive oil." },
      { step: 4, instruction: "Grill for 6-7 minutes per side." },
      { step: 5, instruction: "Serve with lemon wedges." }
    ],

    tags: {
      protein: ["salmon"],
      vegetables: [],
      cuisine: ["mediterranean"],
      mealType: ["lunch", "dinner"],
      method: ["grilled"]
    }
  }
];
