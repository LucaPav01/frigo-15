
import { Info, RefreshCw } from 'lucide-react';
import { PantryItem as PantryItemType } from '@/types/pantry';
import NoResultsFound from '@/components/pantry/NoResultsFound';
import PantryItem from '@/components/pantry/PantryItem';

interface PantryListProps {
  items: PantryItemType[];
  isLoading: boolean;
  mounted: boolean;
  searchQuery: string;
  onItemClick: (item: PantryItemType) => void;
  onQuantityChange: (itemId: number, change: number) => void;
}

const PantryList = ({ 
  items, 
  isLoading, 
  mounted, 
  searchQuery, 
  onItemClick, 
  onQuantityChange 
}: PantryListProps) => {
  
  const hasSearchResults = items.length > 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <RefreshCw className="animate-spin text-muted-foreground" size={24} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {hasSearchResults ? (
        items.map((item, index) => (
          <PantryItem
            key={item.id}
            item={item}
            index={index}
            mounted={mounted}
            onClick={onItemClick}
            onQuantityChange={onQuantityChange}
          />
        ))
      ) : (
        searchQuery ? (
          <NoResultsFound searchQuery={searchQuery} />
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Info size={24} className="text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nessun prodotto trovato.</p>
            <p className="text-xs text-muted-foreground mt-1">Prova a cambiare i filtri o aggiungi nuovi prodotti.</p>
          </div>
        )
      )}
    </div>
  );
};

export default PantryList;
