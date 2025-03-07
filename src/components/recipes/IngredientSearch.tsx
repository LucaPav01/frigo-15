
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, ArrowUpDown } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PantryItem } from "@/types/pantry";
import { useState } from "react";

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'soon': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'critical': return 'Scade Presto';
      case 'soon': return 'Scade a Breve';
      default: return 'Valido';
    }
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
                <div className="flex justify-between items-start">
                  <div className="font-medium text-sm">{item.name}</div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center">
                          <div className={`h-3 w-3 rounded-full ${getStatusColor(item.expiringStatus)}`} />
                          <span className="text-xs ml-1">{getStatusText(item.expiringStatus)}</span>
                        </div>
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
            {searchQuery ? "Nessun ingrediente trovato. Prova una ricerca diversa." : "Nessun ingrediente trovato nella dispensa."}
          </div>
        )}
      </div>
    </div>
  );
};
