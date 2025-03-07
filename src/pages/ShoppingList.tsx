
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Search, CheckSquare, Square, Trash2, Share2, Plus, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mockup data for demonstration
const mockShoppingItems = [
  { id: 1, name: 'Latte', category: 'Dairy', priority: 'high', quantity: '1 l', checked: false },
  { id: 2, name: 'Pane', category: 'Bakery', priority: 'medium', quantity: '1', checked: false },
  { id: 3, name: 'Mele', category: 'Fruits', priority: 'low', quantity: '1 kg', checked: true },
  { id: 4, name: 'Pasta', category: 'Grains', priority: 'medium', quantity: '500 g', checked: false },
  { id: 5, name: 'Pomodori', category: 'Vegetables', priority: 'high', quantity: '6', checked: false },
  { id: 6, name: 'Uova', category: 'Dairy', priority: 'high', quantity: '6', checked: true },
];

// Define the type for shopping items
interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  priority: string;
  quantity: string;
  checked: boolean;
}

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
  // Combine mock items with any finished items or wishlist items
  const [items, setItems] = useState<ShoppingItem[]>([
    ...mockShoppingItems,
    ...getFinishedItems().map((item: ShoppingItem) => ({
      id: item.id + 1000, // Ensure unique ID
      name: item.name,
      category: 'Alimenti terminati',
      priority: 'high',
      quantity: '1',
      checked: false
    })),
    ...getWishlistItems()
  ]);
  
  const [mounted, setMounted] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handleToggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const displayItems = showCompleted 
    ? items 
    : items.filter(item => !item.checked);

  // Group items by category
  const itemsByCategory = displayItems.reduce((acc, item) => {
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

  return (
    <Layout title="Lista della Spesa" showBackButton={true} showLogo={false}>
      <div className="space-y-6">
        <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Cerca prodotti..." 
              className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
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
                    
                    <button className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="fixed right-6 bottom-24 flex flex-col space-y-3">
        <button 
          className="bg-white text-shopping-dark border border-shopping-light p-3 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95"
          aria-label="Share shopping list"
        >
          <Share2 size={20} />
        </button>
        
        <button 
          className="bg-shopping-DEFAULT text-white p-3 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
          aria-label="Add new item"
        >
          <Plus size={20} />
        </button>
      </div>
    </Layout>
  );
};

export default ShoppingList;
