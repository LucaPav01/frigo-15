
import { PantryItem } from "@/types/pantry";

export const mockPantryItems: PantryItem[] = [
  {
    id: 1,
    name: "Pasta",
    category: "Cereali",
    quantity: 2,
    expiration: "2024-12-31",
    expiringStatus: "ok",
    calories: 350,
    protein: 12,
    fat: 1,
    carbs: 70,
    icon: null
  },
  {
    id: 2,
    name: "Pomodori",
    category: "Verdura",
    quantity: 5,
    expiration: "2024-06-15",
    expiringStatus: "ok",
    calories: 20,
    protein: 1,
    fat: 0,
    carbs: 4,
    icon: null
  },
  {
    id: 3,
    name: "Parmigiano",
    category: "Latticini",
    quantity: 1,
    expiration: "2024-08-20",
    expiringStatus: "ok",
    calories: 110,
    protein: 10,
    fat: 7,
    carbs: 1,
    icon: null
  },
  {
    id: 4,
    name: "Basilico",
    category: "Verdura",
    quantity: 1,
    expiration: "2024-06-05",
    expiringStatus: "soon",
    calories: 5,
    protein: 0.5,
    fat: 0.1,
    carbs: 1,
    icon: null
  },
  {
    id: 5,
    name: "Olio d'oliva",
    category: "Proteici",
    quantity: 1,
    expiration: "2025-01-10",
    expiringStatus: "ok",
    calories: 120,
    protein: 0,
    fat: 14,
    carbs: 0,
    icon: null
  }
];
