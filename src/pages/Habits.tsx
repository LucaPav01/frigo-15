
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flame } from 'lucide-react';

const Habits = () => {
  // Diet and nutrition data
  const nutritionData = {
    calories: {
      consumed: 347,
      target: 2500,
      burned: 0
    },
    macros: {
      protein: { consumed: 0, target: 108, color: "text-red-200" },
      fats: { consumed: 0, target: 57, color: "text-yellow-200" },
      carbs: { consumed: 0, target: 291, color: "text-blue-200" },
      fiber: { consumed: 0, target: 22, color: "text-orange-200" }
    }
  };

  // Calculate remaining calories
  const remainingCalories = nutritionData.calories.target - nutritionData.calories.consumed;

  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="habits"
    >
      <div className="max-w-full mx-auto pb-6">
        <div className="flex flex-col items-center justify-center pt-4 pb-10">
          {/* Main calories display */}
          <div className="relative flex flex-col items-center justify-center mb-6">
            <Progress 
              variant="circular" 
              size="lg" 
              value={nutritionData.calories.consumed} 
              max={nutritionData.calories.target}
              indicatorClassName="text-habits-DEFAULT"
              className="text-gray-200"
              showValue={false}
              thickness={10}
            />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{remainingCalories}</span>
              <span className="text-xl text-gray-500">kcal</span>
              <span className="text-sm text-gray-500">rimasti</span>
            </div>
          </div>

          {/* Consumed / Spent calories */}
          <div className="flex w-full justify-between px-6 mb-6">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-semibold">{nutritionData.calories.consumed}</span>
              <span className="text-lg text-gray-500">Consumati</span>
            </div>
            
            <div className="flex flex-col items-center">
              <span className="text-4xl font-semibold">{nutritionData.calories.burned}</span>
              <span className="text-lg text-gray-500">Spesi</span>
            </div>
          </div>

          {/* Fire button */}
          <div className="absolute top-4 right-4">
            <Button 
              variant="outline" 
              className="rounded-full px-6 py-2 border-2"
            >
              <Flame className="text-habits-DEFAULT mr-2" size={20} />
              <span className="text-lg">0</span>
            </Button>
          </div>
        </div>

        {/* Macronutrients card */}
        <Card className="rounded-3xl bg-white shadow-sm mx-4">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-center mb-4">Macronutrienti</h2>
            <div className="h-1 w-24 bg-gray-300 mx-auto mb-8"></div>
            
            <div className="grid grid-cols-4 gap-4">
              {/* Protein */}
              <div className="flex flex-col items-center">
                <Progress 
                  variant="circular" 
                  size="md" 
                  value={nutritionData.macros.protein.consumed} 
                  max={nutritionData.macros.protein.target}
                  indicatorClassName={nutritionData.macros.protein.color}
                  className="mb-2"
                  thickness={6}
                />
                <span className="text-xl font-semibold">
                  {nutritionData.macros.protein.consumed}/{nutritionData.macros.protein.target}g
                </span>
                <span className="text-gray-500">Proteine</span>
              </div>
              
              {/* Fats */}
              <div className="flex flex-col items-center">
                <Progress 
                  variant="circular" 
                  size="md" 
                  value={nutritionData.macros.fats.consumed} 
                  max={nutritionData.macros.fats.target}
                  indicatorClassName={nutritionData.macros.fats.color}
                  className="mb-2"
                  thickness={6}
                />
                <span className="text-xl font-semibold">
                  {nutritionData.macros.fats.consumed}/{nutritionData.macros.fats.target}g
                </span>
                <span className="text-gray-500">Grassi</span>
              </div>
              
              {/* Carbs */}
              <div className="flex flex-col items-center">
                <Progress 
                  variant="circular" 
                  size="md" 
                  value={nutritionData.macros.carbs.consumed} 
                  max={nutritionData.macros.carbs.target}
                  indicatorClassName={nutritionData.macros.carbs.color}
                  className="mb-2"
                  thickness={6}
                />
                <span className="text-xl font-semibold">
                  {nutritionData.macros.carbs.consumed}/{nutritionData.macros.carbs.target}g
                </span>
                <span className="text-gray-500">Carboidrati</span>
              </div>
              
              {/* Fiber */}
              <div className="flex flex-col items-center">
                <Progress 
                  variant="circular" 
                  size="md" 
                  value={nutritionData.macros.fiber.consumed} 
                  max={nutritionData.macros.fiber.target}
                  indicatorClassName={nutritionData.macros.fiber.color}
                  className="mb-2"
                  thickness={6}
                />
                <span className="text-xl font-semibold">
                  {nutritionData.macros.fiber.consumed}/{nutritionData.macros.fiber.target}g
                </span>
                <span className="text-gray-500">Fibre</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Habits;
