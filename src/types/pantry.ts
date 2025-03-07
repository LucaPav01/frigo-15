
import { LucideIcon } from 'lucide-react';

export interface PantryItem {
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
  icon: LucideIcon;
}

export type Category = 'Tutti' | 'Cereali' | 'Proteici' | 'Verdura' | 'Latticini' | 'Frutta';
