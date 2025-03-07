
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { RefreshCw, ScanLine, Plus, Search, Milk, Apple, Wheat, Fish, Salad, X, Info, Mic, Refrigerator, Store, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ManualFoodEntry from '@/components/pantry/ManualFoodEntry';
import VoiceCommandDialog from '@/components/pantry/VoiceCommandDialog';
import QRCodeScanner from '@/components/pantry/QRCodeScanner';
import NoResultsFound from '@/components/pantry/NoResultsFound';
import { toast } from '@/components/ui/use-toast';

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
  { id: 9, name: 'Avena', category: 'Cereali', expiration: '2024-03-15', quantity: 1, expiringStatus: 'ok', calories: 389, protein: 16.9, fat: 6.9, carbs: 66.3, icon: Wheat },
  { id: 10, name: 'Pesce', category: 'Proteici', expiration: '2023-12-13', quantity: 2, expiringStatus: 'soon', calories: 206, protein: 22, fat: 12, carbs: 0, icon: Fish },
  { id: 11, name: 'Tofu', category: 'Proteici', expiration: '2023-12-16', quantity: 1, expiringStatus: 'ok', calories: 76, protein: 8, fat: 4.8, carbs: 1.9, icon: Fish },
  { id: 12, name: 'Carote', category: 'Verdura', expiration: '2023-12-16', quantity: 5, expiringStatus: 'ok', calories: 41, protein: 0.9, fat: 0.2, carbs: 9.6, icon: Salad },
  { id: 13, name: 'Pomodori', category: 'Verdura', expiration: '2023-12-13', quantity: 4, expiringStatus: 'soon', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9, icon: Salad },
  { id: 14, name: 'Parmigiano', category: 'Latticini', expiration: '2024-01-15', quantity: 1, expiringStatus: 'ok', calories: 431, protein: 38.5, fat: 29, carbs: 3.2, icon: Milk },
  { id: 15, name: 'Banana', category: 'Frutta', expiration: '2023-12-12', quantity: 3, expiringStatus: 'soon', calories: 89, protein: 1.1, fat: 0.3, carbs: 22.8, icon: Apple },
  { id: 16, name: 'Arancia', category: 'Frutta', expiration: '2023-12-14', quantity: 2, expiringStatus: 'soon', calories: 47, protein: 0.9, fat: 0.1, carbs: 11.8, icon: Apple },
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

  // Sort items by expiration date (closest first)
  const sortedItems = [...items].sort((a, b) => 
    new Date(a.expiration).getTime() - new Date(b.expiration).getTime()
  );

  // Filter items by category and search query
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

  const handleScanComplete = (itemsAdded: number) => {
    // Add some random items to the pantry
    const newItems = [];
    const categories = ['Cereali', 'Proteici', 'Verdura', 'Latticini', 'Frutta'];
    const names = [
      'Farina', 'Riso Integrale', 'Cereali Colazione', 
      'Tonno', 'Ceci', 'Fagioli', 
      'Zucchine', 'Broccoli', 'Lattuga', 
      'Mozzarella', 'Ricotta', 'Burro', 
      'Kiwi', 'Pera', 'Ananas'
    ];
    
    for (let i = 0; i < itemsAdded; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const nameIndex = Math.floor(Math.random() * names.length);
      const name = names[nameIndex];
      names.splice(nameIndex, 1); // Remove used name
      
      const icon = categoryIcons[category];
      
      newItems.push({
        id: items.length + i + 1,
        name,
        category,
        quantity: Math.floor(Math.random() * 5) + 1,
        expiration: new Date(Date.now() + (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        expiringStatus: 'ok',
        calories: Math.floor(Math.random() * 400) + 50,
        protein: Math.floor(Math.random() * 20) + 1,
        fat: Math.floor(Math.random() * 20) + 1,
        carbs: Math.floor(Math.random() * 50) + 5,
        icon
      });
    }
    
    setItems(prev => [...prev, ...newItems]);
    
    toast({
      title: "Scansione completata",
      description: `Hai aggiunto ${itemsAdded} alimenti alla tua dispensa.`,
    });
  };

  const handleAddItem = () => {
    console.log('Opening manual food entry page');
    setIsManualEntryOpen(true);
  };

  const handleAddNewItem = (name: string, quantity: number, category: string = 'Cereali') => {
    // Find appropriate icon based on category
    const icon = categoryIcons[category] || Wheat;
    
    // Create new item with default values
    const newItem = {
      id: items.length + 1,
      name,
      category,
      quantity,
      expiration: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days from now
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
    
    // Get random food item from the list
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const randomQuantity = Math.floor(Math.random() * 3) + 1;
    
    // Simulate different voice commands
    const actions = ['aggiunto', 'rimosso', 'mangiato'];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    // Update item quantity based on random action
    if (randomAction === 'aggiunto') {
      setItems(prev => prev.map(item => 
        item.id === randomItem.id ? {...item, quantity: item.quantity + randomQuantity} : item
      ));
      
      toast({
        title: "Quantità Aggiornata",
        description: `Hai ${randomAction} ${randomQuantity} ${randomItem.name.toLowerCase()}.`,
      });
    } else {
      setItems(prev => prev.map(item => 
        item.id === randomItem.id ? {...item, quantity: Math.max(0, item.quantity - randomQuantity)} : item
      ));
      
      toast({
        title: "Quantità Aggiornata",
        description: `Hai ${randomAction} ${randomQuantity} ${randomItem.name.toLowerCase()}.`,
      });
    }
    
    setIsVoiceCommandOpen(false);
  };

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  // Custom title for the "Frigo" section
  const customTitle = (
    <h1 className="text-xl font-bold flex items-center" style={{ fontFamily: "Aileron, sans-serif" }}>
      <Refrigerator className="mr-2 text-pantry-DEFAULT" size={22} />
      Frigo
    </h1>
  );

  const hasSearchResults = filteredItems.length > 0;

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                      <span className="px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                        {item.quantity} {item.quantity > 1 ? 'pezzi' : 'pezzo'}
                      </span>
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
            {/* Background image */}
            <div className="rounded-lg overflow-hidden h-40 relative">
              <div 
                className="absolute inset-0 bg-center bg-cover opacity-25"
                style={{ 
                  backgroundImage: `url(/lovable-uploads/0697579a-daf6-47e5-8fff-e30ab8f633fd.png)`,
                  filter: 'blur(1px)'
                }} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              <div className="absolute bottom-3 left-3">
                <h3 className="font-medium text-lg">{selectedItem?.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedItem?.category}</p>
              </div>
            </div>
            
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

      {/* Manual Food Entry Dialog */}
      <ManualFoodEntry 
        isOpen={isManualEntryOpen} 
        onOpenChange={setIsManualEntryOpen} 
        onAddItem={handleAddNewItem} 
        categories={categories.filter(c => c !== 'Tutti')}
      />

      {/* Voice Command Dialog */}
      <VoiceCommandDialog
        isOpen={isVoiceCommandOpen}
        onOpenChange={setIsVoiceCommandOpen}
        onCommandProcess={processVoiceCommand}
      />
      
      {/* QR Code Scanner Dialog */}
      <QRCodeScanner
        isOpen={isQRScannerOpen}
        onOpenChange={setIsQRScannerOpen}
        onScan={handleScanComplete}
      />

      {/* Floating button for QR scanning */}
      <div className="fixed right-6 bottom-24">
        <button 
          onClick={handleScan}
          className="bg-pantry-light text-pantry-DEFAULT p-3.5 rounded-full shadow-md transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Scan QR code"
        >
          <ScanLine size={22} />
        </button>
      </div>

      {/* Floating buttons for voice command and manual entry */}
      <div className="fixed left-6 bottom-24 flex flex-col space-y-3">
        <button
          onClick={handleVoiceCommand}
          className="bg-white text-pantry-dark p-3.5 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Voice command"
        >
          <Mic size={22} />
        </button>
        
        <button
          onClick={handleAddItem}
          className="bg-white text-pantry-dark p-3.5 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95 border border-pantry-light"
          aria-label="Add item manually"
        >
          <Plus size={22} />
        </button>
      </div>
    </Layout>
  );
};

export default Pantry;
