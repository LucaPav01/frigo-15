
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { RefreshCw, ScanLine, Plus, Search, Milk, Apple, Wheat, Fish, Salad, X, Info, Mic, Refrigerator, Store, ShoppingCart, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ManualFoodEntry from '@/components/pantry/ManualFoodEntry';
import VoiceCommandDialog from '@/components/pantry/VoiceCommandDialog';
import QRCodeScanner from '@/components/pantry/QRCodeScanner';
import NoResultsFound from '@/components/pantry/NoResultsFound';
import { toast } from '@/components/ui/use-toast';

interface PantryItem {
  id: number;
  name: string;
  category: string;
  expiration: string;
  quantity: number;
  expiringStatus: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  icon: any;
}

const mockItems = [
  { id: 1, name: 'Latte', category: 'Latticini', expiration: '2023-12-10', quantity: 1, expiringStatus: 'critical', calories: 42, protein: 3.4, fat: 1.0, carbs: 5.0, icon: Milk },
  { id: 2, name: 'Uova', category: 'Proteici', expiration: '2023-12-12', quantity: 6, expiringStatus: 'soon', calories: 155, protein: 13, fat: 11, carbs: 1.1, icon: Fish },
  { id: 3, name: 'Spinaci', category: 'Verdura', expiration: '2023-12-14', quantity: 1, expiringStatus: 'soon', calories: 23, protein: 2.9, fat: 0.4, carbs: 3.6, icon: Salad },
  { id: 4, name: 'Mele', category: 'Frutta', expiration: '2023-12-15', quantity: 4, expiringStatus: 'ok', calories: 52, protein: 0.3, fat: 0.2, carbs: 14, icon: Apple },
  { id: 5, name: 'Pollo', category: 'Proteici', expiration: '2023-12-18', quantity: 1, expiringStatus: 'ok', calories: 165, protein: 31, fat: 3.6, carbs: 0, icon: Fish },
  { id: 6, name: 'Yogurt', category: 'Latticini', expiration: '2023-12-20', quantity: 3, expiringStatus: 'ok', calories: 59, protein: 3.5, fat: 3.3, carbs: 4.7, icon: Milk },
  { id: 7, name: 'Pasta', category: 'Cereali', expiration: '2024-02-15', quantity: 2, expiringStatus: 'ok', calories: 371, protein: 13, fat: 1.5, carbs: 75, icon: Wheat },
  { id: 8, name: 'Riso', category: 'Cereali', expiration: '2024-03-10', quantity: 1, expiringStatus: 'ok', calories: 365, protein: 7.1, fat: 0.7, carbs: 80, icon: Wheat },
  { id: 9, name: 'Avena', category: 'Cereali', expiration: '2024-03-15', quantity: 1, expiringStatus: 'ok', calories: 389, protein: 16.9, fat: 6.9, carbs: 66.3, icon: Wheat },
  { id: 10, name: 'Pesce', category: 'Proteici', expiration: '2023-12-13', quantity: 2, expiringStatus: 'soon', calories: 206, protein: 22, fat: 12, carbs: 0, icon: Fish },
  { id: 11, name: 'Tofu', category: 'Proteici', expiration: '2023-12-16', quantity: 1, expiringStatus: 'ok', calories: 76, protein: 8, fat: 4.8, carbs: 1.9, icon: Fish },
  { id: 12, name: 'Carote', category: 'Verdura', expiration: '2023-12-16', quantity: 5, expiringStatus: 'ok', calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6, icon: Salad },
  { id: 13, name: 'Pomodori', category: 'Verdura', expiration: '2023-12-13', quantity: 4, expiringStatus: 'soon', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, icon: Salad },
  { id: 14, name: 'Parmigiano', category: 'Latticini', expiration: '2024-01-15', quantity: 1, expiringStatus: 'ok', calories: 431, protein: 38.5, fat: 29, carbs: 3.2, icon: Milk },
  { id: 15, name: 'Banana', category: 'Frutta', expiration: '2023-12-12', quantity: 3, expiringStatus: 'soon', calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8, icon: Apple },
  { id: 16, name: 'Arancia', category: 'Frutta', expiration: '2023-12-14', quantity: 2, expiringStatus: 'soon', calories: 47, protein: 0.9, fat: 0.1, carbs: 11.8, icon: Apple },
];

const categories = ['Tutti', 'Cereali', 'Proteici', 'Verdura', 'Latticini', 'Frutta'];

const categoryIcons: Record<string, any> = {
  'Tutti': null,
  'Cereali': Wheat,
  'Proteici': Fish,
  'Verdura': Salad,
  'Latticini': Milk,
  'Frutta': Apple
};

const Pantry = () => {
  const [items, setItems] = useState<PantryItem[]>(mockItems);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isVoiceCommandOpen, setIsVoiceCommandOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

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

  const sortedItems = [...items].sort((a, b) => 
    new Date(a.expiration).getTime() - new Date(b.expiration).getTime()
  );

  const filteredItems = sortedItems
    .filter(item => selectedCategory === 'Tutti' || item.category === selectedCategory)
    .filter(item => 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'soon': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const handleScan = () => {
    console.log('Scanning QR code');
    setIsQRScannerOpen(true);
  };

  const handleScanComplete = (scannedItems: { name: string; quantity: number }[]) => {
    const newItems = scannedItems.map((scannedItem, index) => {
      const category = ['Cereali', 'Proteici', 'Verdura', 'Latticini', 'Frutta'][Math.floor(Math.random() * 5)];
      const icon = categoryIcons[category];
      
      return {
        id: items.length + index + 1,
        name: scannedItem.name,
        category,
        quantity: scannedItem.quantity,
        expiration: new Date(Date.now() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        expiringStatus: 'ok',
        calories: Math.floor(Math.random() * 400) + 50,
        protein: Math.floor(Math.random() * 20) + 1,
        fat: Math.floor(Math.random() * 20) + 1,
        carbs: Math.floor(Math.random() * 50) + 5,
        icon
      };
    });
    
    setItems(prev => [...prev, ...newItems]);
  };

  const handleAddItem = () => {
    console.log('Opening manual food entry page');
    setIsManualEntryOpen(true);
  };

  const handleAddNewItem = (name: string, quantity: number, category: string = 'Cereali') => {
    const icon = categoryIcons[category] || Wheat;
    
    const newItem = {
      id: items.length + 1,
      name,
      category,
      quantity,
      expiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expiringStatus: 'ok',
      calories: 100,
      protein: 5,
      fat: 2,
      carbs: 15,
      icon
    };
    
    setItems(prev => [...prev, newItem]);
    toast({
      title: "Prodotto Aggiunto",
      description: `${name} è stato aggiunto alla tua dispensa.`,
    });
    setIsManualEntryOpen(false);
  };

  const handleVoiceCommand = () => {
    console.log('Opening voice command interface');
    setIsVoiceCommandOpen(true);
  };

  const processVoiceCommand = (command: string) => {
    console.log('Processing voice command:', command);
    
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;
    
    const actions = ['aggiunto', 'rimosso', 'mangiato'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    if (randomAction === 'aggiunto') {
      setItems(prevItems => prevItems.map(item => 
        item.id === randomItem.id ? {...item, quantity: item.quantity + randomQuantity} : item
      ));
      
      toast({
        title: "Quantità Aggiornata",
        description: `Hai ${randomAction} ${randomQuantity} ${randomItem.name.toLowerCase()}.`,
      });
    } else {
      const newQuantity = Math.max(0, randomItem.quantity - randomQuantity);
      
      if (newQuantity === 0) {
        const finishedItem = items.find(item => item.id === randomItem.id);
        
        if (finishedItem) {
          const finishedItems = getFinishedItems();
          localStorage.setItem('finishedItems', JSON.stringify([...finishedItems, finishedItem]));
          
          toast({
            title: "Prodotto Terminato",
            description: `Hai terminato ${finishedItem.name}. È stato aggiunto agli Alimenti terminati.`,
          });
        }
        
        setItems(prevItems => prevItems.filter(item => item.id !== randomItem.id));
      } else {
        setItems(prevItems => prevItems.map(item => 
          item.id === randomItem.id ? {...item, quantity: newQuantity} : item
        ));
        
        toast({
          title: "Quantità Aggiornata",
          description: `Hai ${randomAction} ${randomQuantity} ${randomItem.name.toLowerCase()}.`,
        });
      }
    }
    
    setIsVoiceCommandOpen(false);
  };

  const handleItemClick = (item: PantryItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleQuantityChange = (itemId: number, change: number) => {
    setItems(prev => {
      const updatedItems = prev.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          
          if (newQuantity === 0) {
            const finishedItem = prev.find(i => i.id === itemId);
            
            if (finishedItem) {
              const finishedItems = getFinishedItems();
              localStorage.setItem('finishedItems', JSON.stringify([...finishedItems, finishedItem]));
              
              toast({
                title: "Prodotto Terminato",
                description: `Hai terminato ${finishedItem.name}. È stato aggiunto agli Alimenti terminati.`,
              });
            }
            
            return {...item, quantity: 0};
          }
          
          return {...item, quantity: newQuantity};
        }
        return item;
      });
      
      return updatedItems.filter(item => item.quantity > 0);
    });
    
    if (isDialogOpen && selectedItem?.id === itemId) {
      setIsDialogOpen(false);
    }
  };

  function getFinishedItems(): PantryItem[] {
    try {
      const finishedItems = localStorage.getItem('finishedItems');
      return finishedItems ? JSON.parse(finishedItems) : [];
    } catch (error) {
      return [];
    }
  }

  const hasSearchResults = filteredItems.length > 0;

  return (
    <Layout 
      showBackButton={false} 
      showLogo={false} 
      pageType="pantry"
    >
      <div className="space-y-6">
        <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Cerca ingredienti..." 
              className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={cn("", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => {
              const CategoryIcon = categoryIcons[category];
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-1",
                    isSelected 
                      ? "bg-pantry-light text-pantry-DEFAULT font-medium border-2 border-pantry-DEFAULT"
                      : "bg-secondary/70 text-muted-foreground hover:bg-secondary border-2 border-transparent"
                  )}
                >
                  {CategoryIcon && <CategoryIcon size={14} className={cn(
                    "mr-1",
                    isSelected ? "text-pantry-DEFAULT" : "text-muted-foreground"
                  )} />}
                  <span className={cn(
                    isSelected ? "text-pantry-DEFAULT" : "text-muted-foreground"
                  )}>{category}</span>
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
            {hasSearchResults ? (
              filteredItems.map((item, index) => {
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
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(item.id, -1);
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
                            handleQuantityChange(item.id, 1);
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
              })
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
        )}
      </div>

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
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">Quantità</h3>
                <p className="text-xs text-muted-foreground">
                  {selectedItem?.quantity} {selectedItem?.quantity > 1 ? 'pezzi' : 'pezzo'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => selectedItem && handleQuantityChange(selectedItem.id, -1)}
                  className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
                >
                  <Minus size={16} />
                </button>
                <button
                  onClick={() => selectedItem && handleQuantityChange(selectedItem.id, 1)}
                  className="p-1 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ManualFoodEntry 
        isOpen={isManualEntryOpen} 
        onOpenChange={setIsManualEntryOpen} 
        onAddItem={handleAddNewItem} 
        categories={categories.filter(c => c !== 'Tutti')}
      />

      <VoiceCommandDialog
        isOpen={isVoiceCommandOpen}
        onOpenChange={setIsVoiceCommandOpen}
        onCommandProcess={processVoiceCommand}
      />
      
      <QRCodeScanner
        isOpen={isQRScannerOpen}
        onOpenChange={setIsQRScannerOpen}
        onScan={handleScanComplete}
      />

      <div className="fixed right-6 bottom-24">
        <button 
          onClick={handleScan}
          className="bg-pantry-light text-pantry-DEFAULT p-3 rounded-full shadow-md transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Scan QR code"
        >
          <ScanLine size={20} />
        </button>
      </div>

      <div className="fixed left-6 bottom-24 flex flex-col space-y-3">
        <button
          onClick={handleVoiceCommand}
          className="bg-white text-pantry-dark p-3 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Voice command"
        >
          <Mic size={20} />
        </button>
        
        <button
          onClick={handleAddItem}
          className="bg-white text-pantry-dark p-3 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Add item manually"
        >
          <Plus size={20} />
        </button>
      </div>
    </Layout>
  );
};

export default Pantry;
