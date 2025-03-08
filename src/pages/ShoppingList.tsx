import { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus, MoreVertical, Check, Search, SortAsc } from 'lucide-react';
import { ReactSortable } from "react-sortablejs";

const SAVED_LISTS_KEY = 'shoppingLists';
const DEFAULT_LIST_NAME = 'Lista della spesa';

interface ListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category: string;
}

interface ShoppingListType {
  id: string;
  name: string;
  items: ListItem[];
  createdAt: string;
  sortOrder: string;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const ShoppingList = () => {
  const [lists, setLists] = useState<ShoppingListType[]>([]);
  const [activeList, setActiveList] = useState<ShoppingListType | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Altro');
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [newListName, setNewListName] = useState(DEFAULT_LIST_NAME);
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<ListItem | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteListId, setDeleteListId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('alpha');
  const { toast } = useToast();
  const newItemNameRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Load lists from localStorage
    try {
      const savedLists = localStorage.getItem(SAVED_LISTS_KEY);
      if (savedLists) {
        setLists(JSON.parse(savedLists));
      }
    } catch (error) {
      console.error('Error loading shopping lists:', error);
    }
  }, []);
  
  useEffect(() => {
    // Save lists to localStorage
    try {
      localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify(lists));
    } catch (error) {
      console.error('Error saving shopping lists:', error);
    }
  }, [lists]);
  
  const handleCreateList = () => {
    const newList: ShoppingListType = {
      id: generateId(),
      name: newListName,
      items: [],
      createdAt: new Date().toISOString(),
      sortOrder: 'alpha'
    };
    setLists([...lists, newList]);
    setIsCreateListOpen(false);
    setNewListName(DEFAULT_LIST_NAME);
  };
  
  const handleSelectList = (list: ShoppingListType) => {
    setActiveList(list);
  };
  
  const handleAddItem = () => {
    if (!activeList) return;
    if (!newItemName.trim()) {
      toast({
        title: "Errore!",
        description: "Inserisci un nome per l'oggetto.",
      });
      return;
    }
    
    const newItem: ListItem = {
      id: generateId(),
      name: newItemName,
      quantity: newItemQuantity,
      unit: newItemUnit,
      checked: false,
      category: newItemCategory,
    };
    
    const updatedList: ShoppingListType = {
      ...activeList,
      items: [...activeList.items, newItem],
    };
    
    setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
    setActiveList(updatedList);
    setIsAddItemDialogOpen(false);
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnit('');
    setNewItemCategory('Altro');
  };
  
  const handleEditItem = (item: ListItem) => {
    setEditItem(item);
    setNewItemName(item.name);
    setNewItemQuantity(item.quantity);
    setNewItemUnit(item.unit);
    setNewItemCategory(item.category);
    setIsAddItemDialogOpen(true);
  };
  
  const handleUpdateItem = () => {
    if (!activeList || !editItem) return;
    
    const updatedItem: ListItem = {
      ...editItem,
      name: newItemName,
      quantity: newItemQuantity,
      unit: newItemUnit,
      category: newItemCategory,
    };
    
    const updatedList: ShoppingListType = {
      ...activeList,
      items: activeList.items.map(item => item.id === editItem.id ? updatedItem : item),
    };
    
    setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
    setActiveList(updatedList);
    setIsAddItemDialogOpen(false);
    setEditItem(null);
    setNewItemName('');
    setNewItemQuantity(1);
    setNewItemUnit('');
    setNewItemCategory('Altro');
  };
  
  const handleDeleteItem = (itemId: string) => {
    if (!activeList) return;
    
    const updatedList: ShoppingListType = {
      ...activeList,
      items: activeList.items.filter(item => item.id !== itemId),
    };
    
    setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
    setActiveList(updatedList);
  };
  
  const handleCheckItem = (itemId: string) => {
    if (!activeList) return;
    
    const updatedList: ShoppingListType = {
      ...activeList,
      items: activeList.items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    };
    
    setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
    setActiveList(updatedList);
  };
  
  const handleDeleteList = (listId: string) => {
    setDeleteListId(listId);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDeleteList = () => {
    if (!deleteListId) return;
    
    setLists(lists.filter(list => list.id !== deleteListId));
    setIsDeleteDialogOpen(false);
    setDeleteListId(null);
    setActiveList(null);
  };
  
  const handleGoBack = () => {
    setActiveList(null);
    setSearchTerm('');
  };
  
  const handleClearCompleted = () => {
    if (!activeList) return;
    
    const updatedList: ShoppingListType = {
      ...activeList,
      items: activeList.items.filter(item => !item.checked),
    };
    
    setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
    setActiveList(updatedList);
  };
  
  const filteredItems = activeList?.items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === 'alpha') {
      return a.name.localeCompare(b.name);
    } else if (sortOrder === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  const handleSortOrderChange = (value: string) => {
    setSortOrder(value);
    if (activeList) {
      const updatedList = { ...activeList, sortOrder: value };
      setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
      setActiveList(updatedList);
    }
  };

  const handleReorderItems = (newItems: ListItem[]) => {
    if (!activeList) return;
    const updatedList: ShoppingListType = { ...activeList, items: newItems };
    setLists(lists.map(list => list.id === activeList.id ? updatedList : list));
    setActiveList(updatedList);
  };
  
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="shopping"
    >
      <div className="p-4 max-w-md mx-auto">
        {activeList ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="sm" onClick={handleGoBack}>
                <ChevronLeft size={20} />
                Indietro
              </Button>
              <h2 className="text-xl font-semibold">{activeList.name}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleEditList(activeList)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Modifica nome
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDeleteList(activeList.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Elimina lista
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleClearCompleted}>
                    <Check className="mr-2 h-4 w-4" />
                    Cancella completati
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center mb-4 gap-2">
              <div className="relative flex-1">
                <Input
                  type="search"
                  placeholder="Cerca oggetti..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <Search size={16} />
                </div>
              </div>
              <Select onValueChange={handleSortOrderChange} defaultValue={activeList.sortOrder}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Ordina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alpha">Alfabetico</SelectItem>
                  <SelectItem value="category">Categoria</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sortedItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nessun oggetto trovato</p>
              </div>
            ) : (
              <ReactSortable list={sortedItems} setList={handleReorderItems} handle=".drag-handle">
                <Card className="border-none shadow-none">
                  <CardContent className="p-0">
                    <ScrollArea className="h-[400px] rounded-md">
                      <ul className="divide-y divide-border">
                        {sortedItems.map(item => (
                          <li key={item.id} className="flex items-center justify-between p-4">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="cursor-grab mr-2 opacity-0 hover:opacity-100 drag-handle">
                                <SortAsc className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <Checkbox
                                id={`item-${item.id}`}
                                checked={item.checked}
                                onCheckedChange={() => handleCheckItem(item.id)}
                              />
                              <Label
                                htmlFor={`item-${item.id}`}
                                className="ml-2 text-sm line-clamp-1 flex-1"
                              >
                                {item.name}
                                {item.quantity > 1 && ` (${item.quantity} ${item.unit})`}
                              </Label>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditItem(item)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Modifica
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteItem(item.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Elimina
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </li>
                        ))}
                      </ul>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </ReactSortable>
            )}
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4">Le mie liste</h2>
            {/* Lists View */}
            {lists.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nessuna lista presente</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lists.map(list => (
                  <Card key={list.id} className="cursor-pointer hover:bg-accent transition-colors">
                    <CardContent className="p-3 flex items-center justify-between" onClick={() => handleSelectList(list)}>
                      <div className="text-sm font-medium">{list.name}</div>
                      <Badge variant="secondary" className="text-xs">{list.items.length} oggetti</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Add Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editItem ? 'Modifica Oggetto' : 'Aggiungi Oggetto'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="col-span-3"
                ref={newItemNameRef}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantità
              </Label>
              <Input
                type="number"
                id="quantity"
                value={newItemQuantity.toString()}
                onChange={(e) => setNewItemQuantity(parseInt(e.target.value))}
                className="col-span-1"
                min="1"
              />
              <Label htmlFor="unit" className="text-right col-span-1">
                Unità
              </Label>
              <Input
                id="unit"
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className="col-span-1"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Categoria
              </Label>
              <Select onValueChange={setNewItemCategory} defaultValue={newItemCategory}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frutta e Verdura">Frutta e Verdura</SelectItem>
                  <SelectItem value="Carne e Pesce">Carne e Pesce</SelectItem>
                  <SelectItem value="Latticini e Uova">Latticini e Uova</SelectItem>
                  <SelectItem value="Pane e Pasta">Pane e Pasta</SelectItem>
                  <SelectItem value="Altro">Altro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={editItem ? handleUpdateItem : handleAddItem}>
              {editItem ? 'Aggiorna' : 'Aggiungi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Create List Dialog */}
      <Dialog open={isCreateListOpen} onOpenChange={setIsCreateListOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crea una nuova lista</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nome
              </Label>
              <Input
                id="name"
                defaultValue={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleCreateList}>
              Crea
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete List Alert Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
            <AlertDialogDescription>
              Questa azione eliminerà la lista definitivamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Annulla
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteList}>Elimina</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Floating action buttons */}
      {activeList ? (
        <Button 
          className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600" 
          onClick={() => {
            setIsAddItemDialogOpen(true);
            setEditItem(null);
            setTimeout(() => {
              newItemNameRef.current?.focus();
            }, 100);
          }}
          aria-label="Aggiungi oggetto"
        >
          <Plus className="h-6 w-6" />
        </Button>
      ) : (
        <Button 
          className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600" 
          onClick={() => setIsCreateListOpen(true)}
          aria-label="Crea lista"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}
    </Layout>
  );
};

export default ShoppingList;
