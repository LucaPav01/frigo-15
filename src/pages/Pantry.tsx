
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/use-toast';
import { PantryItem } from '@/types/pantry';
import { 
  mockItems, 
  categories, 
  categoryIcons, 
  getFinishedItems, 
  restoreItemsWithIcons 
} from '@/utils/pantryUtils';
import { ArrowUpDown } from 'lucide-react';

// Components
import SearchBar from '@/components/pantry/SearchBar';
import CategoryFilter from '@/components/pantry/CategoryFilter';
import PantryList from '@/components/pantry/PantryList';
import ItemDetailsDialog from '@/components/pantry/ItemDetailsDialog';
import ManualFoodEntry from '@/components/pantry/ManualFoodEntry';
import VoiceCommandDialog from '@/components/pantry/VoiceCommandDialog';
import QRCodeScanner from '@/components/pantry/QRCodeScanner';
import ActionButtons from '@/components/pantry/ActionButtons';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PANTRY_ITEMS_KEY = 'pantryItems';

type SortOption = 'expiration' | 'name';

const Pantry = () => {
  const [items, setItems] = useState<PantryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Tutti');
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [isVoiceCommandOpen, setIsVoiceCommandOpen] = useState(false);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('expiration');

  useEffect(() => {
    const loadItems = () => {
      try {
        const savedItems = localStorage.getItem(PANTRY_ITEMS_KEY);
        if (savedItems) {
          const parsedItems = JSON.parse(savedItems);
          const itemsWithIcons = parsedItems.map((item: PantryItem) => ({
            ...item,
            icon: categoryIcons[item.category] || null
          }));
          setItems(itemsWithIcons);
        } else {
          setItems(mockItems);
        }
      } catch (error) {
        console.error("Error loading pantry items:", error);
        setItems(mockItems);
      }
      
      setIsLoading(false);
      setMounted(true);
    };

    const timer = setTimeout(loadItems, 500);
    
    return () => {
      clearTimeout(timer);
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        const itemsToSave = items.map(item => ({
          ...item,
          icon: null
        }));
        localStorage.setItem(PANTRY_ITEMS_KEY, JSON.stringify(itemsToSave));
      } catch (error) {
        console.error("Error saving pantry items:", error);
      }
    }
  }, [items, mounted]);

  // Sort items based on the selected sort option
  const sortItems = (itemsToSort: PantryItem[]) => {
    if (sortBy === 'expiration') {
      return [...itemsToSort].sort((a, b) => 
        new Date(a.expiration).getTime() - new Date(b.expiration).getTime()
      );
    } else if (sortBy === 'name') {
      return [...itemsToSort].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
    }
    return itemsToSort;
  };

  const sortedItems = sortItems(items);

  const filteredItems = sortedItems
    .filter(item => selectedCategory === 'Tutti' || item.category === selectedCategory)
    .filter(item => 
      searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
    const icon = categoryIcons[category] || categoryIcons['Cereali'];
    
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
    
    setItems(prevItems => [...prevItems, newItem]);
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
          const cleanItem = { ...finishedItem, icon: null };
          localStorage.setItem('finishedItems', JSON.stringify([...finishedItems, cleanItem]));
          
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
    // Find the item before making any changes (to get the correct name)
    const itemToChange = items.find(item => item.id === itemId);
    
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return {...item, quantity: newQuantity};
        }
        return item;
      });
      
      return updatedItems.filter(item => item.quantity > 0);
    });
    
    // If this was a removal that brought quantity to 0, we need to add to finishedItems
    if (change < 0 && itemToChange && itemToChange.quantity + change <= 0) {
      const finishedItems = getFinishedItems();
      const cleanItem = { ...itemToChange, icon: null, quantity: 0 };
      localStorage.setItem('finishedItems', JSON.stringify([...finishedItems, cleanItem]));
      
      toast({
        title: "Prodotto Terminato",
        description: `Hai terminato ${itemToChange.name}. È stato aggiunto agli Alimenti terminati.`,
      });
    }
    
    if (isDialogOpen && selectedItem?.id === itemId && (selectedItem.quantity + change <= 0)) {
      setIsDialogOpen(false);
    }
  };

  // Custom search bar with sort button
  const PantrySearchBar = () => (
    <div className="relative w-full">
      <input
        type="text"
        placeholder="Cerca nella dispensa..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-12 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pantry-DEFAULT focus:border-transparent"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-2 hover:bg-gray-100"
              onClick={() => setSortBy(sortBy === 'expiration' ? 'name' : 'expiration')}
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
  );

  return (
    <Layout 
      showBackButton={false} 
      showLogo={false} 
      pageType="pantry"
    >
      <div className="space-y-6">
        <PantrySearchBar />

        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          mounted={mounted}
        />

        <PantryList
          items={filteredItems}
          isLoading={isLoading}
          mounted={mounted}
          searchQuery={searchQuery}
          onItemClick={handleItemClick}
          onQuantityChange={handleQuantityChange}
        />
      </div>

      <ItemDetailsDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedItem={selectedItem}
        onQuantityChange={handleQuantityChange}
      />

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

      <ActionButtons
        onVoiceCommand={handleVoiceCommand}
        onAddItem={handleAddItem}
        onScan={handleScan}
      />
    </Layout>
  );
};

export default Pantry;
