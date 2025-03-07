
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Tag, Edit, Save, Plus, X } from 'lucide-react';

interface RecipeFormProps {
  recipeName: string;
  setRecipeName: (name: string) => void;
  instructions: string;
  setInstructions: (instructions: string) => void;
  cookingTime: string;
  setCookingTime: (time: string) => void;
  servings: string;
  setServings: (servings: string) => void;
  tags: string[];
  newTag: string;
  setNewTag: (tag: string) => void;
  addTag: () => void;
  removeTag: (tag: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  saveRecipe: () => void;
}

export const RecipeForm = ({
  recipeName,
  setRecipeName,
  instructions,
  setInstructions,
  cookingTime,
  setCookingTime,
  servings,
  setServings,
  tags,
  newTag,
  setNewTag,
  addTag,
  removeTag,
  isEditing,
  setIsEditing,
  saveRecipe
}: RecipeFormProps) => {
  return (
    <>
      <div className="border p-4 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ricetta Generata da AI</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="gap-1"
          >
            <Edit size={14} />
            {isEditing ? "Annulla Modifiche" : "Modifica"}
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipeName" className="text-muted-foreground text-xs">Nome della ricetta</Label>
            {isEditing ? (
              <Input
                id="recipeName"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
            ) : (
              <div className="font-medium text-lg">{recipeName}</div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instructions" className="text-muted-foreground text-xs">Istruzioni di preparazione</Label>
            {isEditing ? (
              <Textarea
                id="instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="h-40 resize-none"
              />
            ) : (
              <div className="text-sm whitespace-pre-line">{instructions}</div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="cookingTime" className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock size={14} />
                Tempo di cottura (min)
              </Label>
              {isEditing ? (
                <Input
                  id="cookingTime"
                  type="number"
                  min="1"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                />
              ) : (
                <div className="font-medium">{cookingTime} min</div>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="servings" className="text-muted-foreground text-xs flex items-center gap-1">
                <Users size={14} />
                Porzioni
              </Label>
              {isEditing ? (
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              ) : (
                <div className="font-medium">{servings} porzioni</div>
              )}
            </div>
          </div>
          
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs flex items-center gap-1">
              <Tag size={14} />
              Tag
            </Label>
            {isEditing ? (
              <>
                <div className="flex gap-2">
                  <Input
                    placeholder="Es. Vegetariano, Veloce, Senza glutine"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        size={12}
                        className="cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pt-4">
        <Button
          type="button"
          onClick={saveRecipe}
          className="w-full gap-2"
        >
          <Save size={16} />
          Salva Ricetta
        </Button>
      </div>
    </>
  );
};
