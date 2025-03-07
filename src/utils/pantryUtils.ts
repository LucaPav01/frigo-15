
import { PantryItem } from "@/types/pantry";
import { Milk, Apple, Wheat, Fish, Salad } from 'lucide-react';

export const mockItems: PantryItem[] = [
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

export const categories = ['Tutti', 'Cereali', 'Proteici', 'Verdura', 'Latticini', 'Frutta'];

export const categoryIcons: Record<string, any> = {
  'Tutti': null,
  'Cereali': Wheat,
  'Proteici': Fish,
  'Verdura': Salad,
  'Latticini': Milk,
  'Frutta': Apple
};

export const getStatusColor = (status: string) => {
  switch(status) {
    case 'expired': return 'bg-red-800';
    case 'critical': return 'bg-red-500';
    case 'soon': return 'bg-amber-500';
    case 'none': return 'bg-gray-500';
    default: return 'bg-green-500';
  }
};

export const getStatusText = (status: string) => {
  switch(status) {
    case 'expired': return 'Scaduto';
    case 'critical': return 'Scade Presto';
    case 'soon': return 'Scade a Breve';
    case 'none': return 'Nessuna Scadenza';
    default: return 'Valido';
  }
};

export const getExpirationStatus = (expirationDate: string) => {
  if (!expirationDate) return 'none';
  
  const today = new Date();
  const expDate = new Date(expirationDate);
  
  // Check if already expired
  if (expDate < today) return 'expired';
  
  const diffTime = expDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 3) return 'critical';
  if (diffDays <= 7) return 'soon';
  return 'ok';
};

export function getFinishedItems(): PantryItem[] {
  try {
    const finishedItems = localStorage.getItem('finishedItems');
    return finishedItems ? JSON.parse(finishedItems) : [];
  } catch (error) {
    console.error("Error getting finished items:", error);
    return [];
  }
}

// New utility function to restore icons to serialized items
export function restoreItemsWithIcons(items: PantryItem[]): PantryItem[] {
  return items.map(item => ({
    ...item,
    icon: categoryIcons[item.category] || null
  }));
}

// Update pantry items with current expiration status based on today's date
export function updateExpirationStatuses(items: PantryItem[]): PantryItem[] {
  return items.map(item => ({
    ...item,
    expiringStatus: getExpirationStatus(item.expiration)
  }));
}

// Format date to italian format
export function formatDate(dateString: string) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('it-IT');
}
