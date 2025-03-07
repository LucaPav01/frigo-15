
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown, AlertCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PantryItem } from "@/types/pantry";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, formatDate } from "@/utils/pantryUtils";

interface IngredientSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'expiration' | 'name';
  setSortBy: (sortBy: 'expiration' | 'name') => void;
  filteredPantryItems: PantryItem[];
  addIngredient: (ingredient: PantryItem) => void;
}

export const IngredientSearch = ({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  filteredPantryItems,
  addIngredient
}: IngredientSearchProps) => {
  const toggleSortMethod = () => {
    setSortBy(sortBy === 'expiration' ? 'name' : 'expiration');
  };

  return (
    <div className="space-y-2">
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

      <div className="border rounded-md p-4 max-h-[250px] overflow-y-auto">
        {filteredPantryItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredPantryItems.map((item) => (
              <div 
                key={item.id} 
                className="border rounded-md p-3 cursor-pointer hover:bg-accent flex flex-col"
                onClick={() => addIngredient(item)}
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="font-medium text-sm truncate flex items-center">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`h-3 w-3 rounded-full mr-2 ${getStatusColor(item.expiringStatus)}`}></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          {item.expiration ? (
                            <p>Scade il {formatDate(item.expiration)}</p>
                          ) : (
                            <p>Nessuna data di scadenza</p>
                          )}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {item.name}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{item.category}</span>
                  <span>Qta: {item.quantity}</span>
                </div>
                {item.expiringStatus === 'expired' && (
                  <div className="flex items-center text-xs text-destructive mt-1">
                    <AlertCircle size={12} className="mr-1" />
                    <span>Scaduto il {formatDate(item.expiration)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            {searchQuery ? "Nessun ingrediente trovato. Prova una ricerca diversa." : "Nessun ingrediente trovato nella dispensa."}
          </div>
        )}
      </div>
    </div>
  );
};
