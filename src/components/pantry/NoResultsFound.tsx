
import { ShoppingCart, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface NoResultsFoundProps {
  searchQuery: string;
}

const NoResultsFound = ({ searchQuery }: NoResultsFoundProps) => {
  const handleAddToShoppingList = () => {
    // Add to Lista dei desideri in the shopping list
    // This is a simulated action since we don't have a real data store
    localStorage.setItem('wishlistItem', searchQuery);
    
    toast({
      title: "Aggiunto alla lista della spesa",
      description: `${searchQuery} è stato aggiunto alla tua lista dei desideri.`,
    });
  };
  
  const handleBuyFromCoop = () => {
    toast({
      title: "Reindirizzamento a Coop",
      description: `Verrai reindirizzato al sito di Coop per cercare ${searchQuery}.`,
    });
  };
  
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <p className="text-muted-foreground mb-6">Nessun prodotto trovato.</p>
      
      <div className="flex flex-col w-full space-y-3">
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleAddToShoppingList}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Aggiungi a lista della spesa
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start"
          onClick={handleBuyFromCoop}
        >
          <Store className="mr-2 h-4 w-4" />
          Compra su Coop
        </Button>
      </div>
    </div>
  );
};

export default NoResultsFound;
