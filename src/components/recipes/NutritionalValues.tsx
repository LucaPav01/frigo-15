
import { Label } from "@/components/ui/label";

interface NutritionalValuesProps {
  values: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
}

export const NutritionalValues = ({ values }: NutritionalValuesProps) => {
  return (
    <div className="border rounded-md p-4">
      <Label className="mb-2 block">Valori nutrizionali stimati</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground">Calorie</span>
          <span className="font-medium">{Math.round(values.calories)} kcal</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground">Proteine</span>
          <span className="font-medium">{values.protein.toFixed(1)} g</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground">Grassi</span>
          <span className="font-medium">{values.fat.toFixed(1)} g</span>
        </div>
        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
          <span className="text-xs text-muted-foreground">Carboidrati</span>
          <span className="font-medium">{values.carbs.toFixed(1)} g</span>
        </div>
      </div>
    </div>
  );
};
