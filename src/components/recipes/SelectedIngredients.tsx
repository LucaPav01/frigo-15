
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, AlertTriangle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PantryItem } from "@/types/pantry";

interface SelectedIngredient extends PantryItem {
  selectedQuantity: number;
}

interface SelectedIngredientsProps {
  selectedIngredients: SelectedIngredient[];
  updateIngredientQuantity: (id: number, quantity: number) => void;
  removeIngredient: (id: number) => void;
}

export const SelectedIngredients = ({
  selectedIngredients,
  updateIngredientQuantity,
  removeIngredient
}: SelectedIngredientsProps) => {
  return (
    <div className="border rounded-md p-4 space-y-2">
      <Label>Ingredienti selezionati</Label>
      {selectedIngredients.length > 0 ? (
        <div className="space-y-2 max-h-[250px] overflow-y-auto">
          {selectedIngredients.map((item) => (
            <div key={item.id} className="flex items-center justify-between border rounded-md p-2">
              <div className="flex items-center">
                <span className="font-medium text-sm">{item.name}</span>
                {item.expiringStatus === "critical" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="ml-2 text-destructive">
                          <AlertTriangle size={14} />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Scade il {new Date(item.expiration).toLocaleDateString('it-IT')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => updateIngredientQuantity(item.id, item.selectedQuantity - 1)}
                  >
                    <span>-</span>
                  </Button>
                  <span className="mx-2 text-sm">{item.selectedQuantity}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0" 
                    onClick={() => updateIngredientQuantity(item.id, item.selectedQuantity + 1)}
                  >
                    <span>+</span>
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive" 
                  onClick={() => removeIngredient(item.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          Inizia selezionando ingredienti dalla tua dispensa!
        </div>
      )}
    </div>
  );
};
