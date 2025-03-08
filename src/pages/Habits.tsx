
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { CalendarDays, Utensils, Droplets, Activity, ArrowUpRight, ArrowUp, ArrowDown } from 'lucide-react';

const Habits = () => {
  const [selectedDay, setSelectedDay] = useState('today');
  
  const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
  
  // Sample data for charts
  const waterData = [
    { day: 'Lun', amount: 1.2 },
    { day: 'Mar', amount: 1.8 },
    { day: 'Mer', amount: 2.1 },
    { day: 'Gio', amount: 1.6 },
    { day: 'Ven', amount: 2.4 },
    { day: 'Sab', amount: 1.9 },
    { day: 'Dom', amount: 1.5 },
  ];
  
  const caloriesData = [
    { day: 'Lun', consumed: 1850, burned: 420 },
    { day: 'Mar', consumed: 2100, burned: 350 },
    { day: 'Mer', consumed: 1760, burned: 480 },
    { day: 'Gio', consumed: 1900, burned: 400 },
    { day: 'Ven', consumed: 2200, burned: 510 },
    { day: 'Sab', consumed: 2300, burned: 320 },
    { day: 'Dom', consumed: 1950, burned: 280 },
  ];
  
  // Sample nutrition data
  const nutritionData = {
    calories: { consumed: 1850, target: 2000, trend: 'down' },
    protein: { consumed: 75, target: 90, trend: 'up' },
    carbs: { consumed: 210, target: 250, trend: 'steady' },
    fat: { consumed: 65, target: 70, trend: 'steady' },
    water: { consumed: 1.8, target: 2.5, trend: 'up' }
  };
  
  const meals = [
    { name: 'Colazione', time: '08:30', calories: 450, items: ['Yogurt', 'Granola', 'Miele', 'Frutta'] },
    { name: 'Pranzo', time: '13:00', calories: 680, items: ['Insalata di Quinoa', 'Pollo alla griglia', 'Verdure'] },
    { name: 'Spuntino', time: '16:30', calories: 220, items: ['Frutta secca', 'Mela'] },
    { name: 'Cena', time: '20:00', calories: 580, items: ['Salmone', 'Riso integrale', 'Verdure arrostite'] },
  ];
  
  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <ArrowUp size={14} className="text-green-500" />;
      case 'down': return <ArrowDown size={14} className="text-red-500" />;
      default: return <ArrowUpRight size={14} className="text-gray-500" />;
    }
  };
  
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="habits"
    >
      <div className="max-w-full mx-auto">
        {/* Day selector - now as scrollable pills but without horizontal overflow */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 snap-x scrollbar-none w-full pl-1">
          {days.map((day, index) => (
            <Button 
              key={index}
              variant={selectedDay === day.toLowerCase() ? "default" : "outline"}
              className="rounded-full px-4 flex-shrink-0 snap-start"
              onClick={() => setSelectedDay(day.toLowerCase())}
            >
              {day}
            </Button>
          ))}
          <Button 
            variant={selectedDay === 'today' ? "default" : "outline"}
            className="rounded-full px-4 flex-shrink-0 snap-start"
            onClick={() => setSelectedDay('today')}
          >
            Oggi
          </Button>
        </div>
        
        <Tabs defaultValue="summary" className="mb-6">
          <TabsList className="grid grid-cols-3 mb-4 w-full">
            <TabsTrigger value="summary">Riepilogo</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrizione</TabsTrigger>
            <TabsTrigger value="activity">Attività</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary">
            <div className="flex flex-col gap-4 mb-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Utensils className="mr-2 text-recipes-DEFAULT" size={20} />
                    Calorie
                  </CardTitle>
                  <CardDescription>Bilancio calorico giornaliero</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Consumate</span>
                    <span className="font-medium">{nutritionData.calories.consumed} kcal</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Obiettivo</span>
                    <span className="font-medium">{nutritionData.calories.target} kcal</span>
                  </div>
                  <Progress value={(nutritionData.calories.consumed / nutritionData.calories.target) * 100} className="h-2 mb-2" />
                  <div className="text-sm text-muted-foreground flex items-center justify-end">
                    <span className="mr-1">Trend:</span>
                    {getTrendIcon(nutritionData.calories.trend)}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Droplets className="mr-2 text-blue-500" size={20} />
                    Idratazione
                  </CardTitle>
                  <CardDescription>Consumo di acqua giornaliero</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground">Bevuta</span>
                    <span className="font-medium">{nutritionData.water.consumed} L</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-muted-foreground">Obiettivo</span>
                    <span className="font-medium">{nutritionData.water.target} L</span>
                  </div>
                  <Progress value={(nutritionData.water.consumed / nutritionData.water.target) * 100} className="h-2 mb-2" />
                  <div className="text-sm text-muted-foreground flex items-center justify-end">
                    <span className="mr-1">Trend:</span>
                    {getTrendIcon(nutritionData.water.trend)}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <CalendarDays className="mr-2 text-gray-500" size={20} />
                  Pasti di Oggi
                </CardTitle>
                <CardDescription>Riepilogo dei pasti consumati</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meals.map((meal, index) => (
                    <div key={index} className="flex items-center justify-between pb-3 border-b last:border-0">
                      <div>
                        <div className="font-medium">{meal.name} <span className="text-sm font-normal text-muted-foreground ml-2">{meal.time}</span></div>
                        <div className="text-sm text-muted-foreground">{meal.items.join(', ')}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{meal.calories} kcal</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Aggiungi pasto</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Activity className="mr-2 text-habits-DEFAULT" size={20} />
                  Attività settimanale
                </CardTitle>
                <CardDescription>Calorie consumate e bruciate negli ultimi 7 giorni</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={caloriesData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="consumed" name="Calorie consumate" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="burned" name="Calorie bruciate" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="flex flex-col gap-4">
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-lg">Nutrienti</CardTitle>
                  <CardDescription>Distribuzione dei macronutrienti</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Proteine</span>
                        <span className="text-sm font-medium">{nutritionData.protein.consumed}g / {nutritionData.protein.target}g</span>
                      </div>
                      <Progress value={(nutritionData.protein.consumed / nutritionData.protein.target) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Carboidrati</span>
                        <span className="text-sm font-medium">{nutritionData.carbs.consumed}g / {nutritionData.carbs.target}g</span>
                      </div>
                      <Progress value={(nutritionData.carbs.consumed / nutritionData.carbs.target) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Grassi</span>
                        <span className="text-sm font-medium">{nutritionData.fat.consumed}g / {nutritionData.fat.target}g</span>
                      </div>
                      <Progress value={(nutritionData.fat.consumed / nutritionData.fat.target) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Consumo d'acqua</CardTitle>
                  <CardDescription>Ultimi 7 giorni</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={waterData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="amount" name="Litri" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Registra consumo</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Attività fisica</CardTitle>
                <CardDescription>Calorie bruciate negli ultimi 7 giorni</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-medium mb-2">Nessuna attività registrata</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Registra le tue attività fisiche per tenere traccia delle calorie bruciate e dei tuoi progressi
                </p>
                <Button>Aggiungi attività</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Habits;
