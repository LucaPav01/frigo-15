
import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, Users, ChevronRight, BookOpen, Filter, ChefHat } from 'lucide-react';
import CreateRecipeDialog from '@/components/recipes/CreateRecipeDialog';

const Recipes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateRecipeOpen, setIsCreateRecipeOpen] = useState(false);
  
  // Sample recipe data
  const recipes = [
    {
      id: 1,
      title: "Pasta al Pomodoro",
      description: "Classica pasta al pomodoro con basilico fresco",
      image: "https://images.unsplash.com/photo-1598866594230-a7c12756260f?q=80&w=2008&auto=format&fit=crop",
      rating: 4.8,
      time: "25 min",
      servings: 2,
      difficulty: "Facile",
      tags: ["pasta", "vegetariano"]
    },
    {
      id: 2,
      title: "Risotto ai Funghi",
      description: "Cremoso risotto con funghi porcini e parmigiano",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=2070&auto=format&fit=crop",
      rating: 4.5,
      time: "35 min",
      servings: 4,
      difficulty: "Media",
      tags: ["riso", "vegetariano"]
    },
    {
      id: 3,
      title: "Insalata di Quinoa",
      description: "Insalata leggera con quinoa, verdure e avocado",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop",
      rating: 4.2,
      time: "20 min",
      servings: 2,
      difficulty: "Facile",
      tags: ["insalata", "vegan", "senza glutine"]
    }
  ];
  
  const filteredRecipes = recipes.filter(recipe => 
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout 
      showBackButton={false} 
      showLogo={false}
      pageType="recipes"
    >
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center mb-6 gap-2">
          <div className="relative flex-1">
            <Input
              type="search"
              placeholder="Cerca ricette..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
          <Button variant="outline" size="icon">
            <Filter size={18} />
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="all" className="text-xs md:text-sm px-1 md:px-2">Tutte</TabsTrigger>
            <TabsTrigger value="favorites" className="text-xs md:text-sm px-1 md:px-2">Preferite</TabsTrigger>
            <TabsTrigger value="recent" className="text-xs md:text-sm px-1 md:px-2">Recenti</TabsTrigger>
            <TabsTrigger value="custom" className="text-xs md:text-sm px-1 md:px-2">Personalizzate</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map(recipe => (
                <Card key={recipe.id} className="overflow-hidden">
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 h-48 sm:h-auto">
                      <img 
                        src={recipe.image} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle>{recipe.title}</CardTitle>
                          <div className="flex items-center text-amber-500">
                            <Star className="fill-amber-500 mr-1" size={16} />
                            <span className="text-sm">{recipe.rating}</span>
                          </div>
                        </div>
                        <CardDescription>{recipe.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-1" />
                            {recipe.time}
                          </div>
                          <div className="flex items-center">
                            <Users size={14} className="mr-1" />
                            {recipe.servings} porzioni
                          </div>
                          <div className="flex items-center">
                            <BookOpen size={14} className="mr-1" />
                            {recipe.difficulty}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {recipe.tags.map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end">
                        <Button variant="ghost" size="sm" className="gap-1">
                          Dettagli <ChevronRight size={16} />
                        </Button>
                      </CardFooter>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nessuna ricetta trovata</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Nessuna ricetta preferita</h3>
              <p className="text-muted-foreground mb-4">Aggiungi ricette ai preferiti per vederle qui</p>
              <Button>Sfoglia ricette</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recent">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Nessuna ricetta recente</h3>
              <p className="text-muted-foreground mb-4">Le ricette visualizzate di recente appariranno qui</p>
              <Button>Sfoglia ricette</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="custom">
            <div className="text-center py-8">
              <h3 className="text-lg font-medium mb-2">Nessuna ricetta personalizzata</h3>
              <p className="text-muted-foreground mb-4">Crea le tue ricette personalizzate</p>
              <Button>Crea ricetta</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating create recipe button */}
      <Button 
        className="fixed bottom-20 right-4 rounded-full w-14 h-14 shadow-lg bg-orange-500 hover:bg-orange-600" 
        onClick={() => setIsCreateRecipeOpen(true)}
      >
        <ChefHat className="h-6 w-6" />
      </Button>

      <CreateRecipeDialog 
        isOpen={isCreateRecipeOpen} 
        onOpenChange={setIsCreateRecipeOpen} 
      />
    </Layout>
  );
};

export default Recipes;
