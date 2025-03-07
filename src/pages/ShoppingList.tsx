
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Search, CheckSquare, Square, Trash2, Share2, Plus, AlertTriangle, Refrigerator } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';

// Define the type for shopping items
interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  priority: string;
  quantity: string;
  checked: boolean;
}

// Define the type for shopping lists
interface ShoppingListType {
  id: number;
  name: string;
  items: ShoppingItem[];
}

// Mockup data for demonstration
const mockShoppingItems: ShoppingItem[] = [
  { id: 1, name: 'Latte', category: 'Dairy', priority: 'high', quantity: '1 l', checked: false },
  { id: 2, name: 'Pane', category: 'Bakery', priority: 'medium', quantity: '1', checked: false },
  { id: 3, name: 'Mele', category: 'Fruits', priority: 'low', quantity: '1 kg', checked: true },
  { id: 4, name: 'Pasta', category: 'Grains', priority: 'medium', quantity: '500 g', checked: false },
  { id: 5, name: 'Pomodori', category: 'Vegetables', priority: 'high', quantity: '6', checked: false },
  { id: 6, name: 'Uova', category: 'Dairy', priority: 'high', quantity: '6', checked: true },
];

// Get any finished items from localStorage (would be replaced with proper state management in a real app)
const getFinishedItems = (): ShoppingItem[] => {
  try {
    const finishedItems = localStorage.getItem('finishedItems');
    return finishedItems ? JSON.parse(finishedItems) : [];
  } catch (error) {
    return [];
  }
};

// Get any wishlist items from localStorage
const getWishlistItems = (): ShoppingItem[] => {
  try {
    const item = localStorage.getItem('wishlistItem');
    return item ? [{ id: Date.now(), name: item, category: 'Lista dei desideri', priority: 'medium', quantity: '1', checked: false }] : [];
  } catch (error) {
    return [];
  }
};

// Get initial lists
const getInitialLists = (): ShoppingListType[] => {
  try {
    const savedLists = localStorage.getItem('shoppingLists');
    if (savedLists) {
      return JSON.parse(savedLists);
    }
    
    // Default lists if none exist
    return [
      { 
        id: 1, 
        name: 'Lista della spesa', 
        items: mockShoppingItems 
      },
      { 
        id: 2, 
        name: 'Lista dei desideri', 
        items: getWishlistItems() 
      },
      { 
        id: 3, 
        name: 'Alimenti terminati', 
        items: getFinishedItems().map((item: ShoppingItem) => ({
          id: item.id + 1000, // Ensure unique ID
          name: item.name,
          category: 'Alimenti terminati',
          priority: 'high',
          quantity: '1',
          checked: false
        }))
      }
    ];
  } catch (error) {
    return [{ id: 1, name: 'Lista della spesa', items: mockShoppingItems }];
  }
};

const categories = {
  'Dairy': 'Latticini',
  'Bakery': 'Panetteria',
  'Fruits': 'Frutta',
  'Vegetables': 'Verdura',
  'Grains': 'Cereali',
  'Meat': 'Carne',
  'Fish': 'Pesce',
  'Other': 'Altro',
  'Alimenti terminati': 'Alimenti terminati',
  'Lista dei desideri': 'Lista dei desideri'
};

const ShoppingList = () => {
  const [lists, setLists] = useState<ShoppingListType[]>(getInitialLists());
  const [activeListId, setActiveListId] = useState<number>(1);
  const [mounted, setMounted] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Get the active list
  const activeList = lists.find(list => list.id === activeListId) || lists[0];
  const items = activeList.items;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    // Save lists to localStorage when they change
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
  }, [lists]);

  const handleToggleItem = (id: number) => {
    setLists(prevLists => 
      prevLists.map(list => 
        list.id === activeListId 
          ? {
              ...list,
              items: list.items.map(item => 
                item.id === id ? { ...item, checked: !item.checked } : item
              )
            }
          : list
      )
    );
  };

  const handleDeleteItem = (id: number) => {
    setLists(prevLists => 
      prevLists.map(list => 
        list.id === activeListId 
          ? {
              ...list,
              items: list.items.filter(item => item.id !== id)
            }
          : list
      )
    );
  };

  const handleCreateNewList = () => {
    const newListId = Date.now();
    const newList = {
      id: newListId,
      name: `Nuova lista ${lists.length + 1}`,
      items: []
    };
    
    setLists(prev => [...prev, newList]);
    setActiveListId(newListId);
    
    toast({
      title: "Nuova lista creata",
      description: `Hai creato una nuova lista della spesa.`
    });
  };

  const displayItems = showCompleted 
    ? items 
    : items.filter(item => !item.checked);

  // Filter by search query if present
  const filteredItems = searchQuery 
    ? displayItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : displayItems;

  // Group items by category
  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Get unchecked and total count
  const uncheckedCount = items.filter(item => !item.checked).length;
  const totalCount = items.length;

  // Calculate completion percentage
  const completionPercentage = totalCount > 0 
    ? Math.round(((totalCount - uncheckedCount) / totalCount) * 100) 
    : 0;

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    if (category === 'Alimenti terminati') {
      return <AlertTriangle size={16} className="text-red-500 mr-2" />;
    }
    return null;
  };

  // Custom title for the "Lista" section
  const customTitle = (
    <h1 className="text-xl font-bold flex items-center" style={{ fontFamily: "Aileron, sans-serif" }}>
      <Refrigerator className="mr-2 text-shopping-DEFAULT" size={22} />
      Lista
    </h1>
  );

  return (
    <Layout title="Lista della Spesa" showBackButton={true} showLogo={false} customTitle={customTitle}>
      <div className="space-y-6">
        <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Cerca prodotti..." 
              className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className={cn("glass-card", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <div className="p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Progresso</h3>
                <p className="text-sm text-muted-foreground">{totalCount - uncheckedCount} di {totalCount} prodotti</p>
              </div>
              <span className="text-xl font-bold">{completionPercentage}%</span>
            </div>
            
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div 
                className="bg-shopping-DEFAULT h-full transition-all duration-1000 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            
            <div className="flex justify-between">
              <button className="text-sm text-shopping-DEFAULT">Condividi lista</button>
              <button 
                className="text-sm text-muted-foreground"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Nascondi completati' : 'Mostra completati'}
              </button>
            </div>
          </div>
        </div>

        {/* List selector */}
        <div className={cn("", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '250ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {lists.map(list => (
              <button
                key={list.id}
                onClick={() => setActiveListId(list.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all border-2",
                  activeListId === list.id 
                    ? "bg-shopping-light text-shopping-DEFAULT font-medium border-shopping-DEFAULT"
                    : "bg-secondary/70 text-muted-foreground hover:bg-secondary border-transparent"
                )}
              >
                {list.name}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => (
            <div 
              key={category}
              className={cn("space-y-2", mounted ? "opacity-100" : "opacity-0")}
              style={{ transitionDelay: `${300 + categoryIndex * 100}ms`, transition: 'all 0.5s ease-out' }}
            >
              <h3 className="font-medium text-sm text-muted-foreground flex items-center">
                {getCategoryIcon(category)}
                {categories[category as keyof typeof categories] || category}
              </h3>
              
              <div className="space-y-2">
                {categoryItems.map((item, itemIndex) => (
                  <div 
                    key={item.id}
                    className={cn(
                      "glass-card p-3 flex items-center justify-between transition-all duration-200",
                      item.checked ? "bg-gray-50/50" : ""
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => handleToggleItem(item.id)}
                        className="text-shopping-DEFAULT transition-transform active:scale-90"
                      >
                        {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                      
                      <div className={cn("space-y-0.5", item.checked ? "text-muted-foreground line-through" : "")}>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{item.name}</span>
                          <span className={cn(
                            "w-2 h-2 rounded-full",
                            getPriorityColor(item.priority)
                          )} />
                        </div>
                        <p className="text-xs">{item.quantity}</p>
                      </div>
                    </div>
                    
                    <button 
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      onClick={() => handleDeleteItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-muted-foreground mb-2">Nessun prodotto nella lista.</p>
              <p className="text-xs text-muted-foreground">Aggiungi nuovi prodotti usando il pulsante in basso.</p>
            </div>
          )}
        </div>
      </div>

      <div className="fixed left-6 bottom-24">
        <Button 
          onClick={handleCreateNewList}
          className="bg-shopping-DEFAULT text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
          size="icon"
          aria-label="Create new list"
        >
          <Plus size={20} />
        </Button>
      </div>
    </Layout>
  );
};

export default ShoppingList;
