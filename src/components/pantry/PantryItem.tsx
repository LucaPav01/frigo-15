
import { Info, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PantryItem as PantryItemType } from '@/types/pantry';
import { getStatusColor } from '@/utils/pantryUtils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface PantryItemProps {
  item: PantryItemType;
  index: number;
  mounted: boolean;
  onClick: (item: PantryItemType) => void;
  onQuantityChange: (itemId: number, change: number) => void;
}

const PantryItem = ({ item, index, mounted, onClick, onQuantityChange }: PantryItemProps) => {
  const ItemIcon = item.icon || null;
  const expirationDate = new Date(item.expiration).toLocaleDateString('it-IT');
  
  // Get human-readable status text based on expiringStatus
  const getStatusText = (status: string) => {
    switch(status) {
      case 'critical': return 'Scade Presto';
      case 'soon': return 'Scade a Breve';
      default: return 'Valido';
    }
  };
  
  return (
    <div 
      key={item.id}
      onClick={() => onClick(item)}
      className={cn(
        "glass-card p-4 flex items-center justify-between transition-all duration-300 animate-fade-in cursor-pointer hover:bg-gray-50 active:bg-gray-100",
        mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
      style={{ transitionDelay: `${300 + index * 100}ms` }}
    >
      <div className="flex items-center space-x-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={cn("w-2 h-12 rounded-full", getStatusColor(item.expiringStatus))} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Scade il {expirationDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="flex items-center">
          {ItemIcon && <ItemIcon size={18} className="mr-2 text-gray-500" />}
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-xs text-muted-foreground">Scade il {expirationDate}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(item.id, -1);
            }}
            className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
          >
            <Minus size={14} />
          </button>
          <span className="px-2 py-1 bg-secondary rounded-md text-xs font-medium min-w-[40px] text-center">
            {item.quantity} {item.quantity > 1 ? 'pz' : 'pz'}
          </span>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onQuantityChange(item.id, 1);
            }}
            className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
          >
            <Plus size={14} />
          </button>
        </div>
        <Info size={16} className="text-pantry-DEFAULT" />
      </div>
    </div>
  );
};

export default PantryItem;
