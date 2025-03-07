
import { Button } from "@/components/ui/button";
import { Sparkles } from 'lucide-react';

interface GenerateRecipeButtonProps {
  onClick: () => void;
  isGenerating: boolean;
}

export const GenerateRecipeButton = ({ onClick, isGenerating }: GenerateRecipeButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      className="w-full gap-2"
      disabled={isGenerating}
    >
      <Sparkles size={16} />
      {isGenerating ? 'Generazione in corso...' : 'Genera Ricetta AI'}
    </Button>
  );
};
