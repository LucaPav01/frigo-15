import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Search, CheckSquare, Square, Trash2, Plus, AlertTriangle, ShoppingCart, Apple, X, List, ListPlus, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const getInitialLists = (): ShoppingListType[] => {
  try {
    const savedLists = localStorage.getItem('shoppingLists');
    if (savedLists) {
      return JSON.parse(savedLists);
    }
    
    return [
      { 
        id: 1, 
        name: 'Settimanale', 
        items: [
          { id: 1, name: 'Latte', category: 'Dairy', priority: 'high', quantity: '1 l', checked: false },
          { id: 2, name: 'Pane', category: 'Bakery', priority: 'medium', quantity: '1', checked: false },
          { id: 3, name: 'Mele', category: 'Fruits', priority: 'low', quantity: '1 kg', checked: true },
        ] 
      },
      { 
        id: 2, 
        name: 'Terminati', 
        items: [
          { id: 4, name: 'Pasta', category: 'Grains', priority: 'medium', quantity: '500 g', checked: false },
          { id: 5, name: 'Pomodori', category: 'Vegetables', priority: 'high', quantity: '6', checked: false },
        ]
      },
      { 
        id: 3, 
        name: 'Desideri', 
        items: [
          { id: 6, name: 'Uova', category: 'Dairy', priority: 'high', quantity: '6', checked: true },
        ]
      }
    ];
  } catch (error) {
    return [{ 
      id: 1, 
      name: 'Settimanale', 
      items: [
        { id: 1, name: 'Latte', category: 'Dairy', priority: 'high', quantity: '1 l', checked: false },
        { id: 2, name: 'Pane', category: 'Bakery', priority: 'medium', quantity: '1', checked: false },
      ] 
    }];
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
};

const ShoppingList = () => {
  const [lists, setLists] = useState<ShoppingListType[]>(getInitialLists());
  const [activeListId, setActiveListId] = useState<number | null>(null);
  const [showSearch, setShowSearch] = useState(false);
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

  const activeList = activeListId !== null 
    ? lists.find(list => list.id === activeListId) 
    : null;

  useEffect(() => {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
  }, [lists]);

  const handleToggleItem = (id: number) => {
    if (!activeList) return;
    
    setLists(prevLists => 
      prevLists.map(list => 
        list.id === activeList.id 
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
    if (!activeList) return;
    
    setLists(prevLists => 
      prevLists.map(list => 
        list.id === activeList.id 
          ? {
              ...list,
              items: list.items.filter(item => item.id !== id)
            }
          : list
      )
    );
    
    toast({
      title: "Prodotto eliminato",
      description: "Il prodotto è stato rimosso dalla lista."
    });
  };

  const handleDeleteList = (listId: number) => {
    setLists(prevLists => prevLists.filter(list => list.id !== listId));
    
    if (activeListId === listId) {
      setActiveListId(null);
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
    if (!activeList) {
      toast({
        title: "Seleziona una lista",
        description: "Seleziona prima una lista per aggiungere prodotti.",
        variant: "destructive"
      });
      return;
    }
    
    setIsAddItemDialogOpen(true);
  };

  const confirmAddItem = () => {
    if (!activeList) return;
    
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
        list.id === activeList.id 
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

  const calculateProgress = (list: ShoppingListType) => {
    if (list.items.length === 0) return 0;
    const checkedItems = list.items.filter(item => item.checked).length;
    return Math.round((checkedItems / list.items.length) * 100);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Dairy': return '🥛';
      case 'Bakery': return '🍞';
      case 'Fruits': return '🍎';
      case 'Vegetables': return '🥦';
      case 'Grains': return '🌾';
      case 'Meat': return '🥩';
      case 'Fish': return '🐟';
      default: return '📦';
    }
  };

  const getFilteredItems = (items: ShoppingItem[]) => {
    let filteredItems = showCompleted ? items : items.filter(item => !item.checked);
    
    if (searchQuery) {
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return filteredItems;
  };

  const getItemsByCategory = (items: ShoppingItem[]) => {
    return items.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, ShoppingItem[]>);
  };

  return (
    <Layout 
      showBackButton={false} 
      showLogo={false} 
      pageType="shopping"
    >
      <div className="flex flex-col h-full">
        {activeListId === null ? (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-end mb-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleCreateNewList}
                className="text-shopping-DEFAULT hover:bg-shopping-light/50"
                aria-label="Crea nuova lista"
              >
                <ListPlus size={22} />
              </Button>
            </div>

            <ScrollArea className="flex-1 pr-2">
              {lists.length > 0 ? (
                <div className="space-y-3 pb-16">
                  {lists.map(list => {
                    const progress = calculateProgress(list);
                    const totalItems = list.items.length;
                    const checkedItems = list.items.filter(item => item.checked).length;
                    const highPriorityCount = list.items.filter(item => item.priority === 'high' && !item.checked).length;
                    
                    return (
                      <Card 
                        key={list.id}
                        className="border-l-4 hover:bg-accent/30 transition-colors cursor-pointer shadow-sm"
                        style={{ borderLeftColor: highPriorityCount > 0 ? '#ef4444' : '#10b981' }}
                        onClick={() => setActiveListId(list.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-medium">{list.name}</h3>
                            <Button 
                              variant="ghost" 
                              size="icon-xs" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteList(list.id);
                              }}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <Progress value={progress} className="h-1.5 flex-1" />
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {checkedItems}/{totalItems}
                            </span>
                          </div>
                          
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {totalItems === 0 
                                ? "Nessun prodotto" 
                                : `${totalItems} prodott${totalItems === 1 ? 'o' : 'i'}`}
                            </span>
                            
                            {highPriorityCount > 0 && (
                              <span className="text-red-500 font-medium flex items-center gap-1">
                                <AlertTriangle size={14} />
                                {highPriorityCount} urgenti
                              </span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <List size={48} className="text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground mb-2">Nessuna lista creata</p>
                  <Button 
                    size="sm" 
                    className="mt-2 bg-shopping-DEFAULT hover:bg-shopping-dark"
                    onClick={handleCreateNewList}
                  >
                    <Plus size={16} className="mr-1" /> Crea nuova lista
                  </Button>
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon-xs" 
                  onClick={() => setActiveListId(null)}
                  className="text-muted-foreground"
                  aria-label="Torna indietro"
                >
                  <ArrowLeft size={18} />
                </Button>
                <h2 className="text-lg font-medium">{activeList.name}</h2>
              </div>
              
              <div className="flex items-center gap-1">
                {showSearch ? (
                  <div className="relative flex items-center">
                    <Search className="absolute left-2.5 text-muted-foreground" size={16} />
                    <Input
                      placeholder="Cerca prodotti..."
                      className="pl-8 h-8 w-[180px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <Button 
                      variant="ghost" 
                      size="icon-xs" 
                      className="absolute right-1"
                      onClick={() => {
                        setShowSearch(false);
                        setSearchQuery('');
                      }}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="icon-xs" 
                    onClick={() => setShowSearch(true)}
                    className="text-muted-foreground mr-1"
                    aria-label="Cerca prodotti"
                  >
                    <Search size={16} />
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  size="icon-sm"
                  onClick={handleAddItem}
                  className="border-dashed bg-background hover:border-shopping-DEFAULT/40 text-shopping-DEFAULT"
                  aria-label="Aggiungi prodotto"
                >
                  <Plus size={18} />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-secondary/40 p-1 rounded-lg mb-3">
              <span className="text-xs font-medium ml-1">
                {calculateProgress(activeList)}%
              </span>
              <Progress value={calculateProgress(activeList)} className="h-1.5 flex-1" />
              <button 
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowCompleted(!showCompleted)}
              >
                {showCompleted ? 'Nascondi' : 'Mostra'}
              </button>
            </div>
            
            <ScrollArea className="flex-1 pr-2">
              {activeList.items.length > 0 ? (
                <div className="space-y-4 pb-16">
                  {Object.entries(getItemsByCategory(getFilteredItems(activeList.items))).map(([category, items], categoryIndex) => (
                    <div key={category} className="space-y-2">
                      <div className="flex items-center">
                        <h3 className="font-medium text-sm text-foreground flex items-center">
                          <span className="mr-1.5">{getCategoryIcon(category)}</span>
                          {categories[category as keyof typeof categories] || category}
                        </h3>
                        <div className="ml-2 h-px bg-border flex-1"></div>
                      </div>
                      
                      <div className="space-y-2">
                        {items.map((item) => (
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
                                  {item.checked ? <CheckSquare size={22} /> : <Square size={22} />}
                                </button>
                                
                                <div className={cn(item.checked ? "text-muted-foreground line-through" : "")}>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium text-base">{item.name}</span>
                                    <span className={cn(
                                      "w-2 h-2 rounded-full",
                                      getPriorityColor(item.priority)
                                    )} />
                                  </div>
                                  <p className="text-sm text-muted-foreground">{item.quantity}</p>
                                </div>
                              </div>
                              
                              <button 
                                className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                onClick={() => handleDeleteItem(item.id)}
                                aria-label={`Delete ${item.name}`}
                              >
                                <Trash2 size={18} />
                              </button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ShoppingCart size={48} className="text-muted-foreground/50 mb-3" />
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
            </ScrollArea>
          </div>
        )}
      </div>

      <Dialog open={isNewListDialogOpen} onOpenChange={setIsNewListDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crea una nuova lista</DialogTitle>
            <DialogDescription>
              Inserisci un nome per la tua nuova lista della spesa.
            </DialogDescription>
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
            <DialogDescription>
              Aggiungi un nuovo prodotto alla tua lista della spesa.
            </DialogDescription>
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
