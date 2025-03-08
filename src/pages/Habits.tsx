
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Coffee, 
  Utensils, 
  Pizza, 
  Cookie, 
  Flame, 
  Droplets, 
  Plus
} from "lucide-react";

const Habits = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  // Sample data for macronutrients
  const macronutrients = [
    { name: "Proteine", current: 0, target: 108, unit: "g", color: "bg-blue-500" },
    { name: "Grassi", current: 0, target: 67, unit: "g", color: "bg-yellow-500" },
    { name: "Carboidrati", current: 0, target: 300, unit: "g", color: "bg-orange-500" },
    { name: "Fibre", current: 0, target: 30, unit: "g", color: "bg-green-500" }
  ];
  
  // Sample data for meals
  const meals = [
    { name: "Colazione", icon: Coffee, current: 0, target: 646, color: "bg-amber-500" },
    { name: "Pranzo", icon: Utensils, current: 0, target: 710, color: "bg-red-500" },
    { name: "Cena", icon: Pizza, current: 0, target: 646, color: "bg-purple-500" },
    { name: "Spuntino", icon: Cookie, current: 0, target: 430, color: "bg-pink-500" }
  ];
  
  // Calculate total calories remaining
  const totalCaloriesTarget = meals.reduce((sum, meal) => sum + meal.target, 0);
  const consumedCalories = meals.reduce((sum, meal) => sum + meal.current, 0);
  const remainingCalories = totalCaloriesTarget - consumedCalories;
  
  // Water tracking data
  const waterTarget = 1.5; // L
  const waterCurrent = 0; // L
  
  // Activity data
  const caloriesBurned = 0;
  
  // Navigation functions
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };
  
  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };
  
  // Date formatting
  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long'
    };
    
    // Capitalize first letter of the day
    const dateString = date.toLocaleDateString('it-IT', options);
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };
  
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="habits"
      showHeader={true}
    >
      <div className="max-w-full mx-auto space-y-6">
        {/* Macronutrients Section */}
        <section className="sticky top-0 pt-4 pb-2 bg-background z-10">
          <h2 className="font-semibold text-xl mb-3">
            <span className="text-primary">{remainingCalories}</span> kcal rimasti
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {macronutrients.map((macro, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{macro.name}</span>
                    <span className="text-sm">
                      {macro.current} /{macro.target}{macro.unit}
                    </span>
                  </div>
                  <Progress 
                    value={(macro.current / macro.target) * 100} 
                    className="h-2" 
                    indicatorClassName={macro.color}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Date Navigation Bar */}
        <section className="pb-2">
          <Card className="border shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={goToPreviousDay}>
                  <ChevronLeft size={18} />
                </Button>
                
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span className="font-medium">{formatDate(currentDate)}</span>
                </div>
                
                <Button variant="ghost" size="icon" onClick={goToNextDay}>
                  <ChevronRight size={18} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Meal Tracking Section */}
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Pasti</h2>
          {meals.map((meal, index) => (
            <Card key={index} className="border shadow-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <meal.icon size={18} className="text-muted-foreground" />
                    <span className="font-medium">{meal.name}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm">
                      {meal.current} / {meal.target} kcal
                    </span>
                    
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
                <Progress 
                  value={(meal.current / meal.target) * 100} 
                  className="h-2 mt-2" 
                  indicatorClassName={meal.color}
                />
              </CardContent>
            </Card>
          ))}
        </section>
        
        {/* Activity Section */}
        <section className="space-y-3">
          <h2 className="font-semibold text-lg">Attività</h2>
          <Card className="border shadow-sm">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame size={18} className="text-red-500" />
                  <span className="font-medium">Calorie bruciate</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">
                    {caloriesBurned} kcal spesi
                  </span>
                  
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Water Challenge Section */}
        <section className="space-y-3 pb-20">
          <h2 className="font-semibold text-lg">Acqua</h2>
          <Card className="border shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets size={18} className="text-blue-500" />
                  <span className="font-medium">Obiettivo: {waterTarget.toFixed(2).replace('.', ',')} L</span>
                </div>
                
                <span className="text-sm font-medium">
                  {waterCurrent.toFixed(2).replace('.', ',')} L
                </span>
              </div>
              
              <Progress 
                value={(waterCurrent / waterTarget) * 100} 
                className="h-2 mb-4" 
                indicatorClassName="bg-blue-500"
              />
              
              <div className="flex justify-around pt-2">
                {[0.1, 0.25, 0.5].map((amount, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    size="sm" 
                    className="flex gap-1 items-center"
                  >
                    <Plus size={14} />
                    <span>{amount.toFixed(2).replace('.', ',')} L</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Habits;
