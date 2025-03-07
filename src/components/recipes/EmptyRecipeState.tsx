
import { Info, Sparkles } from 'lucide-react';
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

  return (
    <div className="flex flex-col items-center justify-center h-full border rounded-md p-6 text-center">
      <Sparkles className="h-12 w-12 text-amber-500 mb-4" />
      <h3 className="text-lg font-medium mb-2">Genera una ricetta</h3>
      <p className="text-muted-foreground mb-4">
        Hai selezionato {selectedIngredients.length} ingredienti. Fai click sul pulsante "Genera Ricetta AI" per creare una ricetta personalizzata.
      </p>
      <Button 
        onClick={generateRecipe}
        className="gap-2"
        disabled={isGenerating}
      >
        <Sparkles size={16} />
        {isGenerating ? 'Generazione in corso...' : 'Genera Ricetta AI'}
      </Button>
    </div>
  );
};
