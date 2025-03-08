import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Search, CheckSquare, Square, Trash2, Plus, AlertTriangle, Refrigerator, ListPlus, Apple } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ShoppingItem {
  id: number;
  name: string;
  category: string;
  priority: string;
  quantity: string;
  checked: boolean;
}

interface ShoppingListType {
  id: number;
  name: string;
  items: ShoppingItem[];
}

const mockShoppingItems: ShoppingItem[] = [
  { id: 1, name: 'Latte', category: 'Dairy', priority: 'high', quantity: '1 l', checked: false },
  { id: 2, name: 'Pane', category: 'Bakery', priority: 'medium', quantity: '1', checked: false },
  { id: 3, name: 'Mele', category: 'Fruits', priority: 'low', quantity: '1 kg', checked: true },
  { id: 4, name: 'Pasta', category: 'Grains', priority: 'medium', quantity: '500 g', checked: false },
  { id: 5, name: 'Pomodori', category: 'Vegetables', priority: 'high', quantity: '6', checked: false },
  { id: 6, name: 'Uova', category: 'Dairy', priority: 'high', quantity: '6', checked: true },
];

const getFinishedItems = (): ShoppingItem[] => {
  try {
    const finishedItems = localStorage.getItem('finishedItems');
    if (!finishedItems) return [];
    
    const parsedItems = JSON.parse(finishedItems);
    return Array.isArray(parsedItems) ? parsedItems.map(item => ({
      id: item.id + 1000,
      name: item.name,
      category: 'Alimenti terminati',
      priority: 'high',
      quantity: '1',
      checked: false
    })) : [];
  } catch (error) {
    console.error('Error fetching finished items:', error);
    return [];
  }
};

const getWishlistItems = (): ShoppingItem[] => {
  try {
    const wishlistItems = localStorage.getItem('wishlistItems');
    if (!wishlistItems) return [];
    
    const parsedItems = JSON.parse(wishlistItems);
    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error('Error fetching wishlist items:', error);
    return [];
  }
};

const getInitialLists = (): ShoppingListType[] => {
  try {
    const savedLists = localStorage.getItem('shoppingLists');
    if (savedLists) {
      return JSON.parse(savedLists);
    }
    
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
        items: getFinishedItems()
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
  const [isNewListDialogOpen, setIsNewListDialogOpen] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ShoppingItem>>({
    name: '',
    category: 'Other',
    priority: 'medium',
    quantity: '1'
  });

  const activeList = lists.find(list => list.id === activeListId) || lists[0];
  const items = activeList.items;

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
  }, [lists]);

  useEffect(() => {
    const finishedItemsList = lists.find(list => list.name === 'Alimenti terminati');
    if (finishedItemsList) {
      const currentFinishedItems = getFinishedItems();
      if (currentFinishedItems.length > 0) {
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === finishedItemsList.id
              ? { ...list, items: currentFinishedItems }
              : list
          )
        );
      }
    }
    
    const wishlistItemsList = lists.find(list => list.name === 'Lista dei desideri');
    if (wishlistItemsList) {
      const currentWishlistItems = getWishlistItems();
      if (currentWishlistItems.length > 0) {
        setLists(prevLists =>
          prevLists.map(list =>
            list.id === wishlistItemsList.id
              ? { ...list, items: currentWishlistItems }
              : list
          )
        );
      }
    }
  }, []);

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
    
    if (activeList.name === 'Lista dei desideri') {
      const updatedItems = activeList.items.filter(item => item.id !== id);
      localStorage.setItem('wishlistItems', JSON.stringify(updatedItems));
    }
    
    if (activeList.name === 'Alimenti terminati') {
      const updatedItems = activeList.items.filter(item => item.id !== id);
      localStorage.setItem('finishedItems', JSON.stringify(updatedItems));
    }
  };

  const handleDeleteList = (listId: number) => {
    if (listId <= 3) {
      toast({
        title: "Operazione non consentita",
        description: "Non puoi eliminare le liste predefinite.",
        variant: "destructive"
      });
      return;
    }
    
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
    
    if (activeListId === listId) {
      setActiveListId(lists[0].id);
    }
    
    toast({
      title: "Lista eliminata",
      description: "La lista è stata eliminata con successo."
    });
  };

  const handleCreateNewList = () => {
    setIsNewListDialogOpen(true);
  };
  
  const confirmCreateNewList = () => {
    if (!newListName.trim()) {
      toast({
        title: "Nome richiesto",
        description: "Inserisci un nome per la nuova lista.",
        variant: "destructive"
      });
      return;
    }
    
    const newListId = Date.now();
    const newList = {
      id: newListId,
      name: newListName.trim(),
      items: []
    };
    
    setLists(prev => [...prev, newList]);
    setActiveListId(newListId);
    setNewListName('');
    setIsNewListDialogOpen(false);
    
    toast({
      title: "Nuova lista creata",
      description: `Hai creato una nuova lista della spesa: ${newListName.trim()}`
    });
  };

  const handleAddItem = () => {
    setIsAddItemDialogOpen(true);
  };

  const confirmAddItem = () => {
    if (!newItem.name?.trim()) {
      toast({
        title: "Nome richiesto",
        description: "Inserisci un nome per il nuovo prodotto.",
        variant: "destructive"
      });
      return;
    }
    
    const newItemComplete: ShoppingItem = {
      id: Date.now(),
      name: newItem.name.trim(),
      category: newItem.category || 'Other',
      priority: newItem.priority || 'medium',
      quantity: newItem.quantity || '1',
      checked: false
    };
    
    setLists(prev => 
      prev.map(list => 
        list.id === activeListId 
          ? { ...list, items: [...list.items, newItemComplete] }
          : list
      )
    );
    
    setNewItem({
      name: '',
      category: 'Other',
      priority: 'medium',
      quantity: '1'
    });
    
    setIsAddItemDialogOpen(false);
    
    toast({
      title: "Prodotto aggiunto",
      description: `${newItemComplete.name} è stato aggiunto alla lista.`
    });
  };

  const displayItems = showCompleted 
    ? items 
    : items.filter(item => !item.checked);

  const filteredItems = searchQuery 
    ? displayItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : displayItems;

  const itemsByCategory = filteredItems.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  const uncheckedCount = items.filter(item => !item.checked).length;
  const totalCount = items.length;

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
    <Layout 
      showBackButton={false} 
      showLogo={false} 
      pageType="shopping"
    >
      <div className="flex flex-col h-full space-y-4">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-bold flex items-center" style={{ fontFamily: "Aileron, sans-serif" }}>
            <Refrigerator className="mr-2 text-shopping-DEFAULT" size={22} />
            Lista della spesa
          </h1>
          
          <div className={cn(
            "relative w-10 h-10 flex items-center justify-center rounded-full bg-secondary/70 transition-all duration-300",
            searchQuery ? "w-full" : ""
          )}>
            <Search 
              className={cn(
                "absolute left-3 text-muted-foreground transition-all",
                searchQuery ? "opacity-100" : "opacity-100"
              )} 
              size={18} 
              onClick={() => document.getElementById('search-input')?.focus()}
            />
            <input 
              id="search-input"
              type="text" 
              placeholder="Cerca prodotti..." 
              className={cn(
                "w-full bg-transparent rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none transition-all",
                searchQuery ? "opacity-100" : "opacity-0 pointer-events-none"
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                const parent = document.getElementById('search-input')?.parentElement;
                if (parent) parent.classList.add('w-full');
              }}
              onBlur={() => {
                if (!searchQuery) {
                  const parent = document.getElementById('search-input')?.parentElement;
                  if (parent) parent.classList.remove('w-full');
                }
              }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-secondary/40 p-1.5 rounded-lg">
          <span className="text-xs font-medium ml-1">{completionPercentage}%</span>
          <Progress value={completionPercentage} className="h-1.5 flex-1" />
          <button 
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            {showCompleted ? 'Nascondi' : 'Mostra'}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <Tabs value={activeListId.toString()} onValueChange={(value) => setActiveListId(Number(value))} className="w-full">
            <TabsList className="bg-background border h-8 overflow-x-auto w-full justify-start gap-1 p-0.5">
              {lists.map(list => (
                <TabsTrigger 
                  key={list.id} 
                  value={list.id.toString()}
                  className="text-xs py-0.5 px-3 h-7 rounded-full data-[state=active]:bg-shopping-light data-[state=active]:text-shopping-DEFAULT"
                >
                  {list.name}
                  {list.id > 3 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 p-0 hover:bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteList(list.id);
                      }}
                    >
                      <Trash2 size={10} className="text-muted-foreground hover:text-destructive" />
                    </Button>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex justify-between space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-full text-xs border-dashed bg-background hover:border-shopping-DEFAULT/40 text-muted-foreground"
            onClick={handleCreateNewList}
          >
            <ListPlus size={14} className="mr-1" />
            Nuova lista
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 w-full text-xs border-dashed bg-background hover:border-shopping-DEFAULT/40 text-muted-foreground"
            onClick={handleAddItem}
          >
            <Apple size={14} className="mr-1" />
            Aggiungi prodotto
          </Button>
        </div>
        
        <ScrollArea className="flex-1 -mx-2 px-2">
          <div className="space-y-4 pb-16">
            {Object.entries(itemsByCategory).length > 0 ? (
              Object.entries(itemsByCategory).map(([category, categoryItems], categoryIndex) => (
                <div 
                  key={category}
                  className={cn("space-y-2", mounted ? "opacity-100" : "opacity-0")}
                  style={{ 
                    transitionDelay: `${categoryIndex * 100}ms`, 
                    transition: 'opacity 0.3s ease-out' 
                  }}
                >
                  <div className="flex items-center">
                    <h3 className="font-medium text-sm text-foreground flex items-center">
                      {getCategoryIcon(category)}
                      {categories[category as keyof typeof categories] || category}
                    </h3>
                    <div className="ml-2 h-px bg-border flex-1"></div>
                  </div>
                  
                  <div className="space-y-2">
                    {categoryItems.map((item) => (
                      <Card 
                        key={item.id}
                        className={cn(
                          "border-none shadow-sm overflow-hidden transition-all duration-200",
                          item.checked ? "bg-secondary/30" : "bg-card"
                        )}
                      >
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => handleToggleItem(item.id)}
                              className="text-shopping-DEFAULT transition-transform active:scale-90"
                              aria-label={item.checked ? "Mark as uncompleted" : "Mark as completed"}
                            >
                              {item.checked ? <CheckSquare size={20} /> : <Square size={20} />}
                            </button>
                            
                            <div className={cn(item.checked ? "text-muted-foreground line-through" : "")}>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{item.name}</span>
                                <span className={cn(
                                  "w-2 h-2 rounded-full",
                                  getPriorityColor(item.priority)
                                )} />
                              </div>
                              <p className="text-xs text-muted-foreground">{item.quantity}</p>
                            </div>
                          </div>
                          
                          <button 
                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            onClick={() => handleDeleteItem(item.id)}
                            aria-label={`Delete ${item.name}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground mb-2">Nessun prodotto nella lista</p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-shopping-DEFAULT hover:bg-shopping-dark"
                  onClick={handleAddItem}
                >
                  <Plus size={16} className="mr-1" /> Aggiungi prodotti
                </Button>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crea una nuova lista</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input
                placeholder="Nome della lista"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewListDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              className="bg-shopping-DEFAULT hover:bg-shopping-dark"
              onClick={confirmCreateNewList}
            >
              Crea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Aggiungi un prodotto</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Input
                placeholder="Nome del prodotto"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Quantità (es. 1 kg, 500g, 2)"
                value={newItem.quantity}
                onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <div className="text-sm mb-1">Priorità</div>
              <div className="flex space-x-2">
                {['low', 'medium', 'high'].map((priority) => (
                  <Button
                    key={priority}
                    type="button"
                    variant={newItem.priority === priority ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNewItem({...newItem, priority})}
                    className={cn(
                      "flex-1",
                      newItem.priority === priority && 
                      (priority === 'high' ? "bg-red-500" : 
                       priority === 'medium' ? "bg-amber-500" : "bg-green-500")
                    )}
                  >
                    {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Bassa'}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm mb-1">Categoria</div>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {Object.entries(categories).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Annulla
            </Button>
            <Button 
              className="bg-shopping-DEFAULT hover:bg-shopping-dark"
              onClick={confirmAddItem}
            >
              Aggiungi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ShoppingList;
