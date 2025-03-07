import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Clock, 
  Users, 
  X, 
  Plus, 
  Search, 
  Tag, 
  Info, 
  Save,
  Sparkles,
  Edit,
  AlertTriangle,
  ArrowUpDown
} from 'lucide-react';
import { PantryItem } from "@/types/pantry";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const [sortBy, setSortBy] = useState<'expiration' | 'name'>('expiration');
  const [generatedRecipe, setGeneratedRecipe] = useState<boolean>(false);
  const [recipeGenerated, setRecipeGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const today = new Date();
  
  const getExpirationStatus = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 3) return "critical";
    if (diffDays <= 7) return "soon";
    return "ok";
  };

  const pantryItemsWithStatus = mockPantryItems.map(item => ({
    ...item,
    expiringStatus: getExpirationStatus(item.expiration)
  }));

  let filteredPantryItems = pantryItemsWithStatus.filter(item => {
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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'soon': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const getExpirationText = (status: string) => {
    switch(status) {
      case 'critical': return 'Scade Presto';
      case 'soon': return 'Scade a Breve';
      default: return 'Valido';
    }
  };

  const toggleSortMethod = () => {
    setSortBy(sortBy === 'expiration' ? 'name' : 'expiration');
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
            <div className="flex flex-col space-y-2">
              <Label>Ingredienti dalla dispensa</Label>
              <div className="relative w-full">
                <Input
                  placeholder="Cerca ingredienti..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-12"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 hover:bg-gray-100"
                        onClick={toggleSortMethod}
                      >
                        <ArrowUpDown size={18} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Ordina per {sortBy === 'expiration' ? 'Scadenza' : 'Nome'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                      <div className="flex justify-between items-start">
                        <div className="font-medium text-sm">{item.name}</div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className={`h-3 w-3 rounded-full ${getStatusColor(item.expiringStatus)}`} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Scade il {new Date(item.expiration).toLocaleDateString('it-IT')}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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

            {selectedIngredients.length > 0 && !recipeGenerated && (
              <Button 
                onClick={generateRecipe}
                className="w-full gap-2"
                disabled={isGenerating}
              >
                <Sparkles size={16} />
                {isGenerating ? 'Generazione in corso...' : 'Genera Ricetta AI'}
              </Button>
            )}
          </div>

          <div className="space-y-4">
            {generatedRecipe ? (
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
            ) : (
              <>
                {selectedIngredients.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full border rounded-md p-6 text-center">
                    <Info className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Seleziona degli ingredienti</h3>
                    <p className="text-muted-foreground">
                      Seleziona almeno un ingrediente dalla tua dispensa per generare una ricetta
                    </p>
                  </div>
                ) : (
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
                )}
              </>
            )}

            {generatedRecipe && (
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipeDialog;
