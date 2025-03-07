
import { Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { PantryItem } from "@/types/pantry";

interface EmptyRecipeStateProps {
  selectedIngredients: PantryItem[];
  generateRecipe: () => void;
  isGenerating: boolean;
}

export const EmptyRecipeState = ({
  selectedIngredients,
  generateRecipe,
  isGenerating
}: EmptyRecipeStateProps) => {
  if (selectedIngredients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full border rounded-md p-6 text-center">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Seleziona degli ingredienti</h3>
        <p className="text-muted-foreground">
          Seleziona almeno un ingrediente dalla tua dispensa per generare una ricetta
        </p>
      </div>
    );
  }

  // For non-empty ingredient list, we'll now return null since the GenerateRecipeButton
  // component in CreateRecipeDialog.tsx already handles this functionality
  return null;
}
