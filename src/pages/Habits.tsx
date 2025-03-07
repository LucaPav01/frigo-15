
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Plus, ChevronRight, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mockup data for demonstration
const mockMeals = [
  { 
    id: 1, 
    name: 'Colazione', 
    time: '08:30',
    foods: ['Cereali con latte', 'Caffè'],
    calories: 380,
    macros: { carbs: 60, protein: 15, fat: 10 }
  },
  { 
    id: 2, 
    name: 'Pranzo', 
    time: '13:15',
    foods: ['Pasta integrale', 'Insalata mista', 'Pollo alla griglia'],
    calories: 650,
    macros: { carbs: 70, protein: 40, fat: 20 }
  },
  { 
    id: 3, 
    name: 'Spuntino', 
    time: '17:00',
    foods: ['Yogurt greco', 'Noci'],
    calories: 220,
    macros: { carbs: 10, protein: 15, fat: 15 }
  }
];

const dailyGoal = { calories: 2000, carbs: 225, protein: 125, fat: 55 };

const Habits = () => {
  const [meals, setMeals] = useState(mockMeals);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

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

  // Calculate totals for the day
  const totals = meals.reduce((acc, meal) => {
    return {
      calories: acc.calories + meal.calories,
      carbs: acc.carbs + meal.macros.carbs,
      protein: acc.protein + meal.macros.protein,
      fat: acc.fat + meal.macros.fat
    };
  }, { calories: 0, carbs: 0, protein: 0, fat: 0 });

  // Calculate percentages for the progress bars
  const percentages = {
    calories: Math.min((totals.calories / dailyGoal.calories) * 100, 100),
    carbs: Math.min((totals.carbs / dailyGoal.carbs) * 100, 100),
    protein: Math.min((totals.protein / dailyGoal.protein) * 100, 100),
    fat: Math.min((totals.fat / dailyGoal.fat) * 100, 100)
  };

  return (
    <Layout title="Abitudini Alimentari" showBackButton={true} showLogo={false}>
      <div className="space-y-6">
        <div className={cn("glass-card p-4 space-y-4", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Oggi</h3>
            <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString()}</span>
          </div>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Calorie</span>
                <span>{totals.calories} / {dailyGoal.calories} kcal</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-habits-DEFAULT h-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentages.calories}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Carboidrati</span>
                  <span>{totals.carbs}g</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-400 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentages.carbs}%` }}
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Proteine</span>
                  <span>{totals.protein}g</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-red-400 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentages.protein}%` }}
                  />
                </div>
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Grassi</span>
                  <span>{totals.fat}g</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-green-400 h-full transition-all duration-1000 ease-out"
                    style={{ width: `${percentages.fat}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={cn("space-y-1", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <h3 className="font-medium">Pasti di oggi</h3>
          
          <div className="space-y-3 mt-3">
            {meals.map((meal, index) => (
              <div 
                key={meal.id}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex justify-between items-center p-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{meal.name}</h4>
                      <span className="text-xs text-muted-foreground">{meal.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{meal.foods.join(', ')}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm font-medium">{meal.calories} kcal</p>
                      <p className="text-xs text-muted-foreground">
                        {meal.macros.carbs}c / {meal.macros.protein}p / {meal.macros.fat}g
                      </p>
                    </div>
                    <button className="text-muted-foreground hover:text-habits-dark transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("glass-card p-4 space-y-3", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '600ms', transition: 'all 0.5s ease-out' }}>
          <h3 className="font-medium">Consigli per oggi</h3>
          <div className="bg-habits-light text-habits-dark p-3 rounded-lg text-sm">
            <p>Hai consumato poche proteine oggi. Considera di aggiungere uno spuntino proteico come yogurt greco o uova sode.</p>
          </div>
        </div>
      </div>

      <button 
        className="fixed right-6 bottom-24 bg-habits-DEFAULT text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Add new meal"
      >
        <Plus size={24} />
      </button>
    </Layout>
  );
};

export default Habits;
