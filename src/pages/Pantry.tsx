
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { RefreshCw, ScanLine, Plus, Search, Milk, Apple, Wheat, Fish, Salad, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

// Updated mockup data with Italian categories and ordered by expiration date
const mockItems = [
  { id: 1, name: 'Latte', category: 'Latticini', expiration: '2023-12-10', quantity: 1, expiringStatus: 'critical', calories: 42, protein: 3.4, fat: 1.0, carbs: 5.0, icon: Milk },
  { id: 2, name: 'Uova', category: 'Proteici', expiration: '2023-12-12', quantity: 6, expiringStatus: 'soon', calories: 155, protein: 13, fat: 11, carbs: 1.1, icon: Fish },
  { id: 3, name: 'Spinaci', category: 'Verdura', expiration: '2023-12-14', quantity: 1, expiringStatus: 'soon', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, icon: Salad },
  { id: 4, name: 'Mele', category: 'Frutta', expiration: '2023-12-15', quantity: 4, expiringStatus: 'ok', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, icon: Apple },
  { id: 5, name: 'Pollo', category: 'Proteici', expiration: '2023-12-18', quantity: 1, expiringStatus: 'ok', calories: 165, protein: 31, fat: 3.6, carbs: 0, icon: Fish },
  { id: 6, name: 'Yogurt', category: 'Latticini', expiration: '2023-12-20', quantity: 3, expiringStatus: 'ok', calories: 59, protein: 3.5, fat: 3.3, carbs: 4.7, icon: Milk },
  { id: 7, name: 'Pasta', category: 'Cereali', expiration: '2024-02-15', quantity: 2, expiringStatus: 'ok', calories: 371, protein: 13, fat: 1.5, carbs: 75, icon: Wheat },
  { id: 8, name: 'Riso', category: 'Cereali', expiration: '2024-03-10', quantity: 1, expiringStatus: 'ok', calories: 365, protein: 7.1, fat: 0.7, carbs: 80, icon: Wheat },
];

// Order of categories by importance
const categories = ['Tutti', 'Cereali', 'Proteici', 'Verdura', 'Latticini', 'Frutta'];

// Icons for each category
const categoryIcons: Record<string, any> = {
  'Tutti': null,
  'Cereali': Wheat,
  'Proteici': Fish,
  'Verdura': Salad,
  'Latticini': Milk,
  'Frutta': Apple
};

const Pantry = () => {
  const [items, setItems] = useState(mockItems);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setMounted(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  // Sort items by expiration date (closest first)
  const sortedItems = [...items].sort((a, b) => 
    new Date(a.expiration).getTime() - new Date(b.expiration).getTime()
  );

  const filteredItems = selectedCategory === 'Tutti' 
    ? sortedItems 
    : sortedItems.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'soon': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const handleScan = () => {
    console.log('Scanning QR code');
    // Implement QR code scanning
  };

  const handleAddItem = () => {
    console.log('Opening manual food entry page');
    // Implement manual food entry
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // Custom title for the "Frigo" section
  const customTitle = (
    <h1 className="text-xl font-bold" style={{ fontFamily: "Aileron, sans-serif" }}>
      Frigo
    </h1>
  );

  return (
    <Layout showBackButton={false} showLogo={false} customTitle={customTitle}>
      <div className="space-y-6">
        <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Cerca ingredienti..." 
              className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className={cn("", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => {
              const CategoryIcon = categoryIcons[category];
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-1",
                    selectedCategory === category 
                      ? "bg-pantry-DEFAULT text-white font-medium"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary"
                  )}
                >
                  {CategoryIcon && <CategoryIcon size={14} className="mr-1" />}
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => {
              const ItemIcon = item.icon || null;
              return (
                <div 
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "glass-card p-4 flex items-center justify-between transition-all duration-300 animate-fade-in cursor-pointer hover:bg-gray-50 active:bg-gray-100",
                    mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className={cn("w-2 h-12 rounded-full", getStatusColor(item.expiringStatus))} />
                    <div className="flex items-center">
                      {ItemIcon && <ItemIcon size={18} className="mr-2 text-gray-500" />}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">Scade il {new Date(item.expiration).toLocaleDateString('it-IT')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                      {item.quantity} {item.quantity > 1 ? 'pezzi' : 'pezzo'}
                    </span>
                    <Info size={16} className="text-pantry-DEFAULT" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Food Item Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              {selectedItem?.icon && <selectedItem.icon size={20} className="mr-2 text-pantry-DEFAULT" />}
              {selectedItem?.name}
            </DialogTitle>
            <DialogDescription>
              Categoria: {selectedItem?.category}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-sm mb-2">Valori Nutrizionali</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs">
                  <span className="text-muted-foreground">Calorie:</span> {selectedItem?.calories} kcal
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Proteine:</span> {selectedItem?.protein}g
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Grassi:</span> {selectedItem?.fat}g
                </div>
                <div className="text-xs">
                  <span className="text-muted-foreground">Carboidrati:</span> {selectedItem?.carbs}g
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Data di Scadenza</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedItem && new Date(selectedItem.expiration).toLocaleDateString('it-IT')}
                </p>
              </div>
              <div className={cn(
                "px-3 py-1 rounded-full text-xs font-medium text-white",
                selectedItem?.expiringStatus === 'critical' ? "bg-red-500" :
                selectedItem?.expiringStatus === 'soon' ? "bg-amber-500" : "bg-green-500"
              )}>
                {selectedItem?.expiringStatus === 'critical' ? 'Scade presto' : 
                 selectedItem?.expiringStatus === 'soon' ? 'Scade a breve' : 'Valido'}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-sm">Quantità</h3>
              <p className="text-xs text-muted-foreground">
                {selectedItem?.quantity} {selectedItem?.quantity > 1 ? 'pezzi' : 'pezzo'}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Floating buttons */}
      <button 
        onClick={handleScan}
        className="fixed right-6 bottom-24 bg-pantry-DEFAULT text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Scan QR code"
      >
        <ScanLine size={24} />
      </button>
      <button
        onClick={handleAddItem}
        className="fixed left-6 bottom-24 bg-white text-pantry-dark border border-pantry-light p-4 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Add item manually"
      >
        <Plus size={24} />
      </button>
    </Layout>
  );
};

export default Pantry;
