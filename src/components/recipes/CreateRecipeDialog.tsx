import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Users, X, Plus, Search, Tag, Info, Save } from 'lucide-react';
import { PantryItem } from "@/types/pantry";
import { toast } from "@/hooks/use-toast";

// Mock pantry items for the example
const mockPantryItems: PantryItem[] = [
  {
    id: 1,
    name: "Pasta",
    category: "Cereali",
    quantity: 2,
    expiration: "2024-12-31",
    expiringStatus: "ok",
    calories: 350,
    protein: 12,
    fat: 1,
    carbs: 70,
    icon: null
  },
  {
    id: 2,
    name: "Pomodori",
    category: "Verdura",
    quantity: 5,
    expiration: "2024-06-15",
    expiringStatus: "ok",
    calories: 20,
    protein: 1,
    fat: 0,
    carbs: 4,
    icon: null
  },
  {
    id: 3,
    name: "Parmigiano",
    category: "Latticini",
    quantity: 1,
    expiration: "2024-08-20",
    expiringStatus: "ok",
    calories: 110,
    protein: 10,
    fat: 7,
    carbs: 1,
    icon: null
  },
  {
    id: 4,
    name: "Basilico",
    category: "Verdura",
    quantity: 1,
    expiration: "2024-06-05",
    expiringStatus: "soon",
    calories: 5,
    protein: 0.5,
    fat: 0.1,
    carbs: 1,
    icon: null
  },
  {
    id: 5,
    name: "Olio d'oliva",
    category: "Proteici",
    quantity: 1,
    expiration: "2025-01-10",
    expiringStatus: "ok",
    calories: 120,
    protein: 0,
    fat: 14,
    carbs: 0,
    icon: null
  }
];

interface CreateRecipeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SelectedIngredient extends PantryItem {
  selectedQuantity: number;
}

const CreateRecipeDialog = ({ isOpen, onOpenChange }: CreateRecipeDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tutti");
  const [selectedIngredients, setSelectedIngredients] = useState<SelectedIngredient[]>([]);
  const [recipeName, setRecipeName] = useState("");
  const [instructions, setInstructions] = useState("");
  const [cookingTime, setCookingTime] = useState("30");
  const [servings, setServings] = useState("2");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  // Filter pantry items based on search and category
  const filteredPantryItems = mockPantryItems.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "Tutti" || 
      item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate nutritional values based on selected ingredients
  const nutritionalValues = {
    calories: selectedIngredients.reduce((sum, item) => 
      sum + (item.calories * item.selectedQuantity / item.quantity), 0),
    protein: selectedIngredients.reduce((sum, item) => 
      sum + (item.protein * item.selectedQuantity / item.quantity), 0),
    fat: selectedIngredients.reduce((sum, item) => 
      sum + (item.fat * item.selectedQuantity / item.quantity), 0),
    carbs: selectedIngredients.reduce((sum, item) => 
      sum + (item.carbs * item.selectedQuantity / item.quantity), 0)
  };

  // Add ingredient to recipe
  const addIngredient = (ingredient: PantryItem) => {
    const existingIndex = selectedIngredients.findIndex(
      item => item.id === ingredient.id
    );

    if (existingIndex >= 0) {
      // If ingredient already exists, update quantity
      const updatedIngredients = [...selectedIngredients];
      updatedIngredients[existingIndex].selectedQuantity += 1;
      setSelectedIngredients(updatedIngredients);
    } else {
      // Otherwise add new ingredient
      setSelectedIngredients([
        ...selectedIngredients,
        { ...ingredient, selectedQuantity: 1 }
      ]);
    }
  };

  // Remove ingredient from recipe
  const removeIngredient = (ingredientId: number) => {
    setSelectedIngredients(
      selectedIngredients.filter(item => item.id !== ingredientId)
    );
  };

  // Update ingredient quantity
  const updateIngredientQuantity = (ingredientId: number, quantity: number) => {
    if (quantity <= 0) {
      removeIngredient(ingredientId);
      return;
    }

    setSelectedIngredients(
      selectedIngredients.map(item => 
        item.id === ingredientId 
          ? { ...item, selectedQuantity: quantity } 
          : item
      )
    );
  };

  // Add tag to recipe
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  // Remove tag from recipe
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Save recipe
  const saveRecipe = () => {
    // Validate form
    if (!recipeName.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un nome per la ricetta",
        variant: "destructive"
      });
      return;
    }

    if (selectedIngredients.length === 0) {
      toast({
        title: "Errore",
        description: "Aggiungi almeno un ingrediente alla ricetta",
        variant: "destructive"
      });
      return;
    }

    if (!instructions.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci le istruzioni per la ricetta",
        variant: "destructive"
      });
      return;
    }

    // Mock save functionality
    toast({
      title: "Ricetta Salvata",
      description: `La ricetta "${recipeName}" è stata salvata con successo!`
    });

    // Close dialog and reset form
    onOpenChange(false);
    resetForm();
  };

  // Reset form when dialog closes
  const resetForm = () => {
    setSearchQuery("");
    setSelectedCategory("Tutti");
    setSelectedIngredients([]);
    setRecipeName("");
    setInstructions("");
    setCookingTime("30");
    setServings("2");
    setTags([]);
    setNewTag("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Crea una nuova ricetta dalla dispensa</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left column - Pantry ingredients */}
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label>Ingredienti dalla dispensa</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Cerca ingredienti..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <Button variant="outline" onClick={() => setSelectedCategory("Tutti")}>
                  {selectedCategory !== "Tutti" ? selectedCategory : "Tutti"}
                </Button>
              </div>
            </div>

            <div className="border rounded-md p-4 max-h-[250px] overflow-y-auto">
              {filteredPantryItems.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {filteredPantryItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="border rounded-md p-3 cursor-pointer hover:bg-accent flex flex-col"
                      onClick={() => addIngredient(item)}
                    >
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>{item.category}</span>
                        <span>Qta: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  Nessun ingrediente trovato
                </div>
              )}
            </div>

            <div className="border rounded-md p-4 space-y-2">
              <Label>Ingredienti selezionati</Label>
              {selectedIngredients.length > 0 ? (
                <div className="space-y-2 max-h-[250px] overflow-y-auto">
                  {selectedIngredients.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border rounded-md p-2">
                      <span className="font-medium text-sm">{item.name}</span>
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

            <div className="border rounded-md p-4">
              <Label className="mb-2 block">Valori nutrizionali stimati</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Calorie</span>
                  <span className="font-medium">{Math.round(nutritionalValues.calories)} kcal</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Proteine</span>
                  <span className="font-medium">{nutritionalValues.protein.toFixed(1)} g</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Grassi</span>
                  <span className="font-medium">{nutritionalValues.fat.toFixed(1)} g</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted/50 rounded-md">
                  <span className="text-xs text-muted-foreground">Carboidrati</span>
                  <span className="font-medium">{nutritionalValues.carbs.toFixed(1)} g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Recipe details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipeName">Nome della ricetta</Label>
              <Input
                id="recipeName"
                placeholder="Es. Pasta al pomodoro e basilico"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Istruzioni di preparazione</Label>
              <Textarea
                id="instructions"
                placeholder="Scrivi le istruzioni passo dopo passo..."
                className="h-40 resize-none"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cookingTime" className="flex items-center gap-1">
                  <Clock size={14} />
                  Tempo di cottura (min)
                </Label>
                <Input
                  id="cookingTime"
                  type="number"
                  min="1"
                  value={cookingTime}
                  onChange={(e) => setCookingTime(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings" className="flex items-center gap-1">
                  <Users size={14} />
                  Porzioni
                </Label>
                <Input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Tag size={14} />
                Tag
              </Label>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeDialog;
