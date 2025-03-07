
export interface Recipe {
  id: number;
  title: string;
  description?: string;
  image?: string;
  rating?: number;
  time: string;
  servings: number;
  difficulty?: string;
  tags: string[];
  instructions: string;
  isCustom?: boolean;
  createdAt: string;
}
