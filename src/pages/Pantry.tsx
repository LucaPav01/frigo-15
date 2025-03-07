
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/use-toast';
import { PantryItem } from '@/types/pantry';
import { mockItems, categories, categoryIcons, getFinishedItems } from '@/utils/pantryUtils';

// Components
import SearchBar from '@/components/pantry/SearchBar';
import CategoryFilter from '@/components/pantry/CategoryFilter';
import PantryList from '@/components/pantry/PantryList';
import ItemDetailsDialog from '@/components/pantry/ItemDetailsDialog';
import ManualFoodEntry from '@/components/pantry/ManualFoodEntry';
import VoiceCommandDialog from '@/components/pantry/VoiceCommandDialog';
import QRCodeScanner from '@/components/pantry/QRCodeScanner';
import ActionButtons from '@/components/pantry/ActionButtons';

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

  return (
    <Layout 
      showBackButton={false} 
      showLogo={false} 
      pageType="pantry"
    >
      <div className="space-y-6">
        <SearchBar 
          searchQuery={searchQuery}
          onChange={setSearchQuery}
          mounted={mounted}
        />

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
