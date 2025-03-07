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
      const ingredientsByCategory = selectedIngredients.reduce((acc, ingredient) => {
        if (!acc[ingredient.category]) {
          acc[ingredient.category] = [];
        }
        acc[ingredient.category].push(ingredient.name);
        return acc;
      }, {});
      
      const allIngredientNames = selectedIngredients.map(ing => ing.name.toLowerCase());
      
      const mainIngredients = selectedIngredients
        .sort((a, b) => b.selectedQuantity - a.selectedQuantity)
        .slice(0, 3)
        .map(ing => ing.name);
      
      let generatedName = '';
      
      if (mainIngredients.length === 1) {
        generatedName = mainIngredients[0];
      } else if (mainIngredients.length === 2) {
        generatedName = `${mainIngredients[0]} e ${mainIngredients[1]}`;
      } else if (mainIngredients.length >= 3) {
        generatedName = `${mainIngredients[0]} con ${mainIngredients.slice(1).join(' e ')}`;
      }
      
      const hasFruits = selectedIngredients.some(ing => 
        ing.category === 'Frutta' || 
        ['banana', 'mela', 'pera', 'arancia', 'limone', 'fragola'].some(fruit => 
          ing.name.toLowerCase().includes(fruit)
        )
      );
      
      const hasEggs = allIngredientNames.some(name => 
        name.includes('uov') || name.includes('egg')
      );
      
      const hasPasta = allIngredientNames.some(name => 
        name.includes('pasta') || name.includes('spaghetti') || name.includes('penne')
      );
      
      const hasRice = allIngredientNames.some(name => 
        name.includes('riso') || name.includes('rice')
      );
      
      const hasMeat = selectedIngredients.some(ing => 
        ing.category === 'Proteici' || 
        ['pollo', 'manzo', 'maiale', 'tacchino', 'carne'].some(meat => 
          ing.name.toLowerCase().includes(meat)
        )
      );
      
      const hasVegetables = selectedIngredients.some(ing => 
        ing.category === 'Verdura' || 
        ['carota', 'pomodoro', 'zucchina', 'insalata', 'spinaci'].some(veg => 
          ing.name.toLowerCase().includes(veg)
        )
      );
      
      const hasFlour = allIngredientNames.some(name => 
        name.includes('farina') || name.includes('flour')
      );
      
      const hasMilk = allIngredientNames.some(name => 
        name.includes('latte') || name.includes('milk')
      );
      
      let dishType = '';
      
      if (hasEggs && hasFruits) {
        dishType = 'Frittata dolce';
      } else if (hasEggs && hasVegetables) {
        dishType = 'Frittata';
      } else if (hasPasta) {
        dishType = 'Pasta';
      } else if (hasRice) {
        dishType = 'Risotto';
      } else if (hasFlour && hasEggs && hasMilk && hasFruits) {
        dishType = 'Torta';
      } else if (hasFlour && hasEggs && hasMilk) {
        dishType = 'Crêpe';
      } else if (hasMeat && hasVegetables) {
        dishType = 'Piatto unico';
      } else if (hasFruits && hasMilk) {
        dishType = 'Frullato';
      } else if (hasFruits) {
        dishType = 'Macedonia';
      } else {
        dishType = 'Piatto';
      }
      
      setRecipeName(`${dishType} di ${generatedName}`);
      
      let generatedInstructions = '';
      
      if (hasEggs && hasFruits) {
        generatedInstructions += `1. Sbatti ${hasEggs ? '2-3 uova' : 'le uova'} in una ciotola e aggiungi un pizzico di sale.\n\n`;
        generatedInstructions += `2. Taglia ${hasFruits ? mainIngredients.filter(ing => 
          ['banana', 'mela', 'pera', 'arancia', 'fragola'].some(fruit => 
            ing.toLowerCase().includes(fruit)
          )).join(' e ') : 'la frutta'} a pezzetti.\n\n`;
        generatedInstructions += `3. Aggiungi la frutta alle uova e mescola delicatamente.\n\n`;
        generatedInstructions += `4. Scalda un filo d'olio in una padella antiaderente e versa il composto.\n\n`;
        generatedInstructions += `5. Cuoci a fuoco medio-basso per 3-4 minuti per lato finché la frittata è dorata.\n\n`;
        generatedInstructions += `6. Servi calda, spolverizzando con un po' di zucchero a velo se disponibile.`;
      } else if (hasPasta) {
        generatedInstructions += `1. Porta a ebollizione una pentola d'acqua salata e cuoci ${hasPasta ? 'la pasta' : '250g di pasta'} secondo le indicazioni sulla confezione.\n\n`;
        
        if (hasVegetables) {
          generatedInstructions += `2. Mentre la pasta cuoce, taglia ${hasVegetables ? mainIngredients.filter(ing => 
            ing.toLowerCase().includes('pomodor') || 
            ing.toLowerCase().includes('zucchin') || 
            ing.toLowerCase().includes('carota') || 
            ing.toLowerCase().includes('spinaci')
          ).join(' e ') : 'le verdure'} a pezzetti e saltale in padella con un filo d'olio.\n\n`;
          
          if (hasMeat) {
            generatedInstructions += `3. In un'altra padella, cuoci ${hasMeat ? mainIngredients.filter(ing => 
              ing.toLowerCase().includes('pollo') || 
              ing.toLowerCase().includes('manzo') || 
              ing.toLowerCase().includes('carne')
            ).join(' e ') : 'la carne'} fino a quando è ben rosolata.\n\n`;
            generatedInstructions += `4. Unisci la carne alle verdure e lascia insaporire per qualche minuto.\n\n`;
            generatedInstructions += `5. Scola la pasta al dente e uniscila al condimento, mescolando bene.\n\n`;
          } else {
            generatedInstructions += `3. Scola la pasta al dente e uniscila alle verdure in padella.\n\n`;
            generatedInstructions += `4. Aggiungi un filo d'olio a crudo e servi subito.`;
          }
        } else if (hasMeat) {
          generatedInstructions += `2. In una padella, cuoci ${hasMeat ? mainIngredients.filter(ing => 
            ing.toLowerCase().includes('pollo') || 
            ing.toLowerCase().includes('manzo') || 
            ing.toLowerCase().includes('carne')
          ).join(' e ') : 'la carne'} con un filo d'olio fino a doratura.\n\n`;
          generatedInstructions += `3. Aggiungi gli altri ingredienti e lascia cuocere per qualche minuto.\n\n`;
          generatedInstructions += `4. Scola la pasta al dente e uniscila al condimento in padella.\n\n`;
          generatedInstructions += `5. Mescola bene e servi caldo.`;
        } else if (hasFruits) {
          generatedInstructions += `2. In una padella, scalda un po' di burro e aggiungi ${hasFruits ? mainIngredients.filter(ing => 
            ['banana', 'mela', 'pera', 'arancia', 'fragola'].some(fruit => 
              ing.toLowerCase().includes(fruit)
            )).join(' e ') : 'la frutta'} tagliata a pezzetti.\n\n`;
          generatedInstructions += `3. Aggiungi un cucchiaio di zucchero e fai caramellare la frutta per 3-4 minuti.\n\n`;
          generatedInstructions += `4. Scola la pasta e uniscila alla frutta caramellata.\n\n`;
          generatedInstructions += `5. Servi subito come piatto dolce-salato sperimentale.`;
        } else {
          generatedInstructions += `2. Prepara un condimento semplice con gli ingredienti selezionati.\n\n`;
          generatedInstructions += `3. Scola la pasta e condiscila con il preparato.\n\n`;
          generatedInstructions += `4. Servi subito.`;
        }
      } else if (hasRice) {
        generatedInstructions += `1. Scalda un fondo d'olio in una padella e tosta ${hasRice ? 'il riso' : '200g di riso'} per un paio di minuti.\n\n`;
        
        if (hasVegetables) {
          generatedInstructions += `2. Aggiungi ${hasVegetables ? mainIngredients.filter(ing => 
            ing.toLowerCase().includes('pomodor') || 
            ing.toLowerCase().includes('zucchin') || 
            ing.toLowerCase().includes('carota') || 
            ing.toLowerCase().includes('spinaci')
          ).join(' e ') : 'le verdure'} tagliate a cubetti e fai rosolare.\n\n`;
          generatedInstructions += `3. Versa il brodo poco alla volta, mescolando spesso, fino a cottura del riso.\n\n`;
          
          if (hasMeat) {
            generatedInstructions += `4. In una padella separata, cuoci ${hasMeat ? mainIngredients.filter(ing => 
              ing.toLowerCase().includes('pollo') || 
              ing.toLowerCase().includes('manzo') || 
              ing.toLowerCase().includes('carne')
            ).join(' e ') : 'la carne'} fino a doratura.\n\n`;
            generatedInstructions += `5. Unisci la carne al risotto a fine cottura e manteca con un poco di formaggio.\n\n`;
            generatedInstructions += `6. Lascia riposare per un minuto prima di servire.`;
          } else {
            generatedInstructions += `4. A fine cottura, manteca con un poco di formaggio se disponibile.\n\n`;
            generatedInstructions += `5. Servi caldo, guarnendo con erbe fresche.`;
          }
        } else if (hasFruits) {
          generatedInstructions += `2. Aggiungi ${hasFruits ? mainIngredients.filter(ing => 
            ['banana', 'mela', 'pera', 'arancia', 'fragola'].some(fruit => 
              ing.toLowerCase().includes(fruit)
            )).join(' e ') : 'la frutta'} tagliata a cubetti.\n\n`;
          generatedInstructions += `3. Versa latte a poco a poco, mescolando spesso, fino a cottura del riso.\n\n`;
          generatedInstructions += `4. Aggiungi un po' di zucchero e cannella se disponibile.\n\n`;
          generatedInstructions += `5. Servi come dessert di riso con frutta.`;
        } else {
          generatedInstructions += `2. Aggiungi gli ingredienti selezionati e fai rosolare.\n\n`;
          generatedInstructions += `3. Versa il brodo poco alla volta, mescolando spesso, fino a cottura del riso.\n\n`;
          generatedInstructions += `4. Manteca con un poco di burro o formaggio e servi.`;
        }
      } else if (hasFlour && hasEggs && hasMilk && hasFruits) {
        generatedInstructions += `1. Preriscalda il forno a 180°C.\n\n`;
        generatedInstructions += `2. In una ciotola, mescola ${hasFlour ? '200g di farina' : 'la farina'}, 150g di zucchero, un pizzico di sale e una bustina di lievito.\n\n`;
        generatedInstructions += `3. In un'altra ciotola, sbatti ${hasEggs ? '2 uova' : 'le uova'} con ${hasMilk ? '100ml di latte' : 'il latte'} e 50g di burro fuso.\n\n`;
        generatedInstructions += `4. Unisci gli ingredienti liquidi a quelli secchi e mescola fino ad ottenere un composto omogeneo.\n\n`;
        generatedInstructions += `5. Taglia ${hasFruits ? mainIngredients.filter(ing => 
          ['banana', 'mela', 'pera', 'arancia', 'fragola'].some(fruit => 
            ing.toLowerCase().includes(fruit)
          )).join(' e ') : 'la frutta'} a pezzetti e incorporala all'impasto.\n\n`;
        generatedInstructions += `6. Versa il composto in uno stampo imburrato e infarinato.\n\n`;
        generatedInstructions += `7. Cuoci in forno per circa 35-40 minuti o fino a quando uno stuzzicadenti inserito al centro esce pulito.\n\n`;
        generatedInstructions += `8. Lascia raffreddare prima di servire.`;
      } else if (hasFruits && hasMilk) {
        generatedInstructions += `1. Taglia ${hasFruits ? mainIngredients.filter(ing => 
          ['banana', 'mela', 'pera', 'arancia', 'fragola'].some(fruit => 
            ing.toLowerCase().includes(fruit)
          )).join(' e ') : 'la frutta'} a pezzetti.\n\n`;
        generatedInstructions += `2. Metti la frutta nel frullatore insieme a ${hasMilk ? '200ml di latte' : 'il latte'}.\n\n`;
        generatedInstructions += `3. Aggiungi un cucchiaio di miele o zucchero se desideri un frullato più dolce.\n\n`;
        generatedInstructions += `4. Frulla fino ad ottenere un composto omogeneo.\n\n`;
        generatedInstructions += `5. Servi immediatamente, eventualmente con dei cubetti di ghiaccio.`;
      } else if (hasFruits) {
        generatedInstructions += `1. Lava e taglia ${hasFruits ? mainIngredients.filter(ing => 
          ['banana', 'mela', 'pera', 'arancia', 'fragola'].some(fruit => 
            ing.toLowerCase().includes(fruit)
          )).join(' e ') : 'la frutta'} a pezzetti.\n\n`;
        generatedInstructions += `2. Metti la frutta in una ciotola.\n\n`;
        generatedInstructions += `3. Aggiungi un cucchiaio di succo di limone per evitare che la frutta si ossidi.\n\n`;
        generatedInstructions += `4. Se desideri, aggiungi un cucchiaio di miele o zucchero per dolcificare.\n\n`;
        generatedInstructions += `5. Mescola bene e servi fresca, eventualmente con un po' di yogurt.`;
      } else {
        generatedInstructions += `1. Prepara gli ingredienti selezionati, lavandoli e tagliandoli se necessario.\n\n`;
        generatedInstructions += `2. Combina ${selectedIngredients.map(ing => ing.name).join(', ')} in un recipiente adatto.\n\n`;
        generatedInstructions += `3. Cuoci o prepara secondo le necessità degli ingredienti scelti.\n\n`;
        generatedInstructions += `4. Aggiusta di sale e spezie a piacere prima di servire.`;
      }
      
      setInstructions(generatedInstructions);
      
      let estimatedTime = 30;
      if (hasPasta) estimatedTime = 20;
      else if (hasRice) estimatedTime = 25;
      else if (hasEggs && !hasFlour) estimatedTime = 15;
      else if (hasFlour && hasEggs && hasMilk) estimatedTime = 45;
      else if (hasFruits && hasMilk && !hasFlour) estimatedTime = 5;
      else if (hasFruits && !hasMilk && !hasFlour) estimatedTime = 10;
      else if (hasMeat) estimatedTime = 25;
      
      setCookingTime(estimatedTime.toString());
      
      const totalIngredients = selectedIngredients.reduce((sum, ing) => sum + ing.selectedQuantity, 0);
      const estimatedServings = Math.max(1, Math.min(4, Math.round(totalIngredients / 3)));
      setServings(estimatedServings.toString());
      
      const newTags: string[] = [];
      
      if (!hasMeat) newTags.push("Vegetariano");
      if (hasVegetables && !hasMeat) newTags.push("Sano");
      if (estimatedTime <= 15) newTags.push("Veloce");
      if (hasPasta) newTags.push("Pasta");
      if (hasRice) newTags.push("Riso");
      if (hasEggs) newTags.push("Uova");
      if (hasFruits) newTags.push("Frutta");
      if (hasFruits && hasMilk && !hasFlour) newTags.push("Frullato");
      if (hasFlour && hasEggs && hasMilk && hasFruits) newTags.push("Dolce");
      
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
