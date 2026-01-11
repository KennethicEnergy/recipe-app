export type Recipe = {
  id: string;
  name: string;
  description: string;

  rating: {
    average: number;
    count: number;
  };

  cookTime: {
    prepMinutes: number;
    cookMinutes: number;
    totalMinutes: number;
  };

  ingredients: {
    name: string;
    type: "meat" | "vegetable" | "seafood" | "other";
    amount?: string;
  }[];

  procedure: {
    step: number;
    instruction: string;
  }[];

  tags: {
    protein: string[];
    vegetables: string[];
    cuisine: string[];
    mealType: string[];
    method: string[];
  };

  media?: {
    images?: string[];
    video?: {
      url: string;
      platform: "youtube" | "vimeo" | "local";
      thumbnail?: string;
    };
  };
};
