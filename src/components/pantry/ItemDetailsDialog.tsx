
import { PantryItem } from '@/types/pantry';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from '@/lib/utils';
import { Minus, Plus } from 'lucide-react';

interface ItemDetailsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedItem: PantryItem | null;
  onQuantityChange: (itemId: number, change: number) => void;
}

const ItemDetailsDialog = ({ isOpen, onOpenChange, selectedItem, onQuantityChange }: ItemDetailsDialogProps) => {
  if (!selectedItem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            {selectedItem.icon && <selectedItem.icon size={20} className="mr-2 text-pantry-DEFAULT" />}
            {selectedItem.name}
          </DialogTitle>
          <DialogDescription>
            Categoria: {selectedItem.category}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-sm mb-2">Valori Nutrizionali</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="text-xs">
                <span className="text-muted-foreground">Calorie:</span> {selectedItem.calories} kcal
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Proteine:</span> {selectedItem.protein}g
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Grassi:</span> {selectedItem.fat}g
              </div>
              <div className="text-xs">
                <span className="text-muted-foreground">Carboidrati:</span> {selectedItem.carbs}g
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">Data di Scadenza</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(selectedItem.expiration).toLocaleDateString('it-IT')}
              </p>
            </div>
            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium text-white",
              selectedItem.expiringStatus === 'critical' ? "bg-red-500" :
              selectedItem.expiringStatus === 'soon' ? "bg-amber-500" : "bg-green-500"
            )}>
              {selectedItem.expiringStatus === 'critical' ? 'Scade presto' : 
               selectedItem.expiringStatus === 'soon' ? 'Scade a breve' : 'Valido'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-sm">Quantità</h3>
              <p className="text-xs text-muted-foreground">
                {selectedItem.quantity} {selectedItem.quantity > 1 ? 'pezzi' : 'pezzo'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => onQuantityChange(selectedItem.id, -1)}
                className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
              >
                <Minus size={16} />
              </button>
              <button
                onClick={() => onQuantityChange(selectedItem.id, 1)}
                className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemDetailsDialog;
