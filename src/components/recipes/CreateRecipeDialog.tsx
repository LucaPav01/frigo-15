import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChefHat } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { PantryItem } from "@/types/pantry";
import { IngredientSearch } from "./IngredientSearch";
import { SelectedIngredients } from "./SelectedIngredients";
import { NutritionalValues } from "./NutritionalValues";
import { GenerateRecipeButton } from "./GenerateRecipeButton";
import { RecipeForm } from "./RecipeForm";
import { EmptyRecipeState } from "./EmptyRecipeState";
import { restoreItemsWithIcons, updateExpirationStatuses } from "@/utils/pantryUtils";

const PANTRY_ITEMS_KEY = 'pantryItems';

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
  const [sortBy, setSortBy] = useState<'expiration' | 'name'>('expiration');
  const [generatedRecipe, setGeneratedRecipe] = useState<boolean>(false);
  const [recipeGenerated, setRecipeGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [pantryItems, setPantryItems] = useState<PantryItem[]>([]);

  useEffect(() => {
    const loadPantryItems = () => {
      try {
        const savedItems = localStorage.getItem(PANTRY_ITEMS_KEY);
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          const itemsWithIcons = restoreItemsWithIcons(parsedItems);
          setPantryItems(itemsWithIcons);
        } else {
          setPantryItems([]);
        }
      } catch (error) {
        console.error("Error loading pantry items:", error);
        setPantryItems([]);
      }
    };

    loadPantryItems();
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PANTRY_ITEMS_KEY) {
        loadPantryItems();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isOpen]);

  let filteredPantryItems = pantryItems.filter(item => {
    return searchQuery === "" || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (sortBy === 'expiration') {
    filteredPantryItems = filteredPantryItems.sort((a, b) => 
      new Date(a.expiration).getTime() - new Date(b.expiration).getTime()
    );
  } else if (sortBy === 'name') {
    filteredPantryItems = filteredPantryItems.sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

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
    setGeneratedRecipe(false);
    setRecipeGenerated(false);
    setIsEditing(false);
    setSortBy('expiration');
  };

  const addIngredient = (ingredient: PantryItem) => {
    const isExpired = ingredient.expiringStatus === "expired";
    
    if (isExpired) {
      toast({
        title: "Attenzione",
        description: `${ingredient.name} è scaduto. Considera di sostituirlo.`,
        variant: "destructive"
      });
    }
    
    const existingIndex = selectedIngredients.findIndex(
      item => item.id === ingredient.id
    );

    if (existingIndex >= 0) {
      const updatedIngredients = [...selectedIngredients];
      updatedIngredients[existingIndex].selectedQuantity += 1;
      setSelectedIngredients(updatedIngredients);
    } else {
      setSelectedIngredients([
        ...selectedIngredients,
        { ...ingredient, selectedQuantity: 1 }
      ]);
    }
    
    setRecipeGenerated(false);
    setGeneratedRecipe(false);
  };

  const removeIngredient = (ingredientId: number) => {
    setSelectedIngredients(
      selectedIngredients.filter(item => item.id !== ingredientId)
    );
    
    setRecipeGenerated(false);
    setGeneratedRecipe(false);
  };

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
    
    setRecipeGenerated(false);
    setGeneratedRecipe(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const generateRecipe = () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "Nessun ingrediente selezionato",
        description: "Seleziona almeno un ingrediente per generare una ricetta",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    setTimeout(() => {
      const mainIngredients = selectedIngredients
        .slice(0, 3)
        .map(ing => ing.name);
      
      const generatedName = mainIngredients.length > 1 
        ? `${mainIngredients[0]} con ${mainIngredients.slice(1).join(' e ')}`
        : mainIngredients[0];
      
      setRecipeName(generatedName);
      
      const hasPasta = selectedIngredients.some(ing => 
        ing.name.toLowerCase().includes('pasta'));
      const hasRice = selectedIngredients.some(ing => 
        ing.name.toLowerCase().includes('riso'));
      const hasMeat = selectedIngredients.some(ing => 
        ing.category === 'Proteici');
      const hasVegetables = selectedIngredients.some(ing => 
        ing.category === 'Verdura');
      
      let generatedInstructions = '';
      
      if (hasPasta) {
        generatedInstructions += "1. Porta a ebollizione una pentola d'acqua salata e cuoci la pasta secondo le indicazioni sulla confezione.\n\n";
        
        if (hasVegetables) {
          generatedInstructions += "2. Mentre la pasta cuoce, taglia le verdure a pezzetti e saltale in padella con un filo d'olio.\n\n";
          
          if (hasMeat) {
            generatedInstructions += "3. In un'altra padella, cuoci la carne fino a quando è ben rosolata.\n\n";
            generatedInstructions += "4. Unisci la carne alle verdure e lascia insaporire per qualche minuto.\n\n";
            generatedInstructions += "5. Scola la pasta al dente e uniscila al condimento, mescolando bene.\n\n";
            generatedInstructions += "6. Servi con una spolverata di formaggio grattugiato.";
          } else {
            generatedInstructions += "3. Scola la pasta al dente e uniscila alle verdure in padella.\n\n";
            generatedInstructions += "4. Aggiungi un filo d'olio a crudo e servi subito.";
          }
        } else if (hasMeat) {
          generatedInstructions += "2. In una padella, cuoci la carne con un filo d'olio fino a doratura.\n\n";
          generatedInstructions += "3. Aggiungi gli altri ingredienti e lascia cuocere per qualche minuto.\n\n";
          generatedInstructions += "4. Scola la pasta al dente e uniscila al condimento in padella.\n\n";
          generatedInstructions += "5. Mescola bene e servi caldo.";
        } else {
          generatedInstructions += "2. Prepara un condimento semplice con gli ingredienti selezionati.\n\n";
          generatedInstructions += "3. Scola la pasta e condiscila con il preparato.\n\n";
          generatedInstructions += "4. Servi subito.";
        }
      } else if (hasRice) {
        generatedInstructions += "1. Scalda un fondo d'olio in una padella e tosta il riso per un paio di minuti.\n\n";
        
        if (hasVegetables) {
          generatedInstructions += "2. Aggiungi le verdure tagliate a cubetti e fai rosolare.\n\n";
          generatedInstructions += "3. Versa il brodo poco alla volta, mescolando spesso, fino a cottura del riso.\n\n";
          
          if (hasMeat) {
            generatedInstructions += "4. In una padella separata, cuoci la carne fino a doratura.\n\n";
            generatedInstructions += "5. Unisci la carne al risotto a fine cottura e manteca con un poco di formaggio.\n\n";
            generatedInstructions += "6. Lascia riposare per un minuto prima di servire.";
          } else {
            generatedInstructions += "4. A fine cottura, manteca con un poco di formaggio se disponibile.\n\n";
            generatedInstructions += "5. Servi caldo, guarnendo con erbe fresche.";
          }
        } else {
          generatedInstructions += "2. Aggiungi gli ingredienti selezionati e fai rosolare.\n\n";
          generatedInstructions += "3. Versa il brodo poco alla volta, mescolando spesso, fino a cottura del riso.\n\n";
          generatedInstructions += "4. Manteca con un poco di burro o formaggio e servi.";
        }
      } else if (hasVegetables) {
        generatedInstructions += "1. Lava e taglia le verdure in pezzi regolari.\n\n";
        
        if (hasMeat) {
          generatedInstructions += "2. In una padella, fai rosolare la carne con un filo d'olio.\n\n";
          generatedInstructions += "3. Aggiungi le verdure e fai cuocere a fuoco medio per 10-15 minuti.\n\n";
          generatedInstructions += "4. Aggiusta di sale e pepe e servi caldo.";
        } else {
          generatedInstructions += "2. Scalda un filo d'olio in padella e aggiungi le verdure.\n\n";
          generatedInstructions += "3. Cuoci a fuoco medio per 10-15 minuti, mescolando occasionalmente.\n\n";
          generatedInstructions += "4. Condisci con sale, pepe e le spezie preferite.";
        }
      } else if (hasMeat) {
        generatedInstructions += "1. Prepara la carne, rimuovendo eventuali parti di grasso in eccesso.\n\n";
        generatedInstructions += "2. Scalda un filo d'olio in padella e fai rosolare la carne a fuoco vivo.\n\n";
        generatedInstructions += "3. Riduci il fuoco e prosegui la cottura fino a quando la carne è ben cotta.\n\n";
        generatedInstructions += "4. Aggiusta di sale e pepe e servi con un contorno a scelta.";
      } else {
        generatedInstructions += "1. Prepara gli ingredienti selezionati, lavandoli e tagliandoli se necessario.\n\n";
        generatedInstructions += "2. Combina gli ingredienti in un recipiente adatto.\n\n";
        generatedInstructions += "3. Cuoci o prepara secondo le necessità degli ingredienti scelti.\n\n";
        generatedInstructions += "4. Aggiusta di sale e spezie a piacere prima di servire.";
      }
      
      setInstructions(generatedInstructions);
      
      const estimatedTime = hasPasta || hasRice ? 30 : (hasMeat ? 25 : 15);
      setCookingTime(estimatedTime.toString());
      
      const totalIngredients = selectedIngredients.reduce((sum, ing) => sum + ing.selectedQuantity, 0);
      const estimatedServings = Math.max(1, Math.round(totalIngredients / 3));
      setServings(estimatedServings.toString());
      
      const newTags: string[] = [];
      
      if (!hasMeat) newTags.push("Vegetariano");
      if (hasVegetables && !hasMeat) newTags.push("Sano");
      if (estimatedTime <= 20) newTags.push("Veloce");
      if (hasPasta) newTags.push("Pasta");
      if (hasRice) newTags.push("Riso");
      
      setTags(newTags);
      
      setGeneratedRecipe(true);
      setRecipeGenerated(true);
      setIsGenerating(false);
    }, 1500);
  };

  const saveRecipe = () => {
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

    toast({
      title: "Ricetta Salvata",
      description: `La ricetta "${recipeName}" è stata salvata con successo!`
    });

    onOpenChange(false);
    resetForm();
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
          <div className="space-y-4">
            {pantryItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 border rounded-md p-6 text-center">
                <p className="text-muted-foreground">
                  La tua dispensa è vuota. Aggiungi ingredienti per iniziare!
                </p>
              </div>
            ) : (
              <IngredientSearch
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                sortBy={sortBy}
                setSortBy={setSortBy}
                filteredPantryItems={filteredPantryItems}
                addIngredient={addIngredient}
              />
            )}

            <SelectedIngredients
              selectedIngredients={selectedIngredients}
              updateIngredientQuantity={updateIngredientQuantity}
              removeIngredient={removeIngredient}
            />

            <NutritionalValues values={nutritionalValues} />

            {selectedIngredients.length > 0 && !recipeGenerated && (
              <GenerateRecipeButton
                onClick={generateRecipe}
                isGenerating={isGenerating}
              />
            )}
          </div>

          <div className="space-y-4">
            {generatedRecipe ? (
              <RecipeForm
                recipeName={recipeName}
                setRecipeName={setRecipeName}
                instructions={instructions}
                setInstructions={setInstructions}
                cookingTime={cookingTime}
                setCookingTime={setCookingTime}
                servings={servings}
                setServings={setServings}
                tags={tags}
                newTag={newTag}
                setNewTag={setNewTag}
                addTag={addTag}
                removeTag={removeTag}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                saveRecipe={saveRecipe}
              />
            ) : (
              <EmptyRecipeState
                selectedIngredients={selectedIngredients}
                generateRecipe={generateRecipe}
                isGenerating={isGenerating}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeDialog;
