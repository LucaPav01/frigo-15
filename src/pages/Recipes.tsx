
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Search, Filter, Heart, Clock, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mockup data for demonstration
const mockRecipes = [
  { 
    id: 1, 
    name: 'Pasta al Pomodoro', 
    description: 'Un classico italiano semplice e gustoso',
    time: '25 min',
    difficulty: 'Facile',
    ingredients: ['Pasta', 'Pomodoro', 'Aglio', 'Basilico'],
    image: 'https://source.unsplash.com/random/300x200/?pasta'
  },
  { 
    id: 2, 
    name: 'Insalata Greca', 
    description: 'Fresca e nutriente, perfetta per l\'estate',
    time: '15 min',
    difficulty: 'Facile',
    ingredients: ['Pomodoro', 'Cetriolo', 'Feta', 'Olive'],
    image: 'https://source.unsplash.com/random/300x200/?salad'
  },
  { 
    id: 3, 
    name: 'Risotto ai Funghi', 
    description: 'Cremoso e ricco di sapore',
    time: '35 min',
    difficulty: 'Media',
    ingredients: ['Riso', 'Funghi', 'Cipolla', 'Brodo'],
    image: 'https://source.unsplash.com/random/300x200/?risotto'
  }
];

const filters = ['Tutti', 'Preferiti', 'Veloci', 'Vegetariani', 'Senza Glutine'];

const Recipes = () => {
  const [recipes, setRecipes] = useState(mockRecipes);
  const [selectedFilter, setSelectedFilter] = useState('Tutti');
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

  return (
    <Layout title="Ricette" showBackButton={true} showLogo={false}>
      <div className="space-y-6">
        <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Cerca ricette..." 
              className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
            <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-recipes-light text-recipes-dark p-1 rounded-full">
              <Filter size={16} />
            </button>
          </div>
        </div>

        <div className={cn("", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all",
                  selectedFilter === filter 
                    ? "bg-recipes-DEFAULT text-white font-medium"
                    : "bg-secondary/70 text-muted-foreground hover:bg-secondary"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {recipes.map((recipe, index) => (
            <div 
              key={recipe.id}
              className={cn(
                "glass-card overflow-hidden transition-all duration-300 rounded-xl",
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                  loading="lazy"
                />
                <button className="absolute top-3 right-3 bg-white/80 rounded-full p-2 shadow-sm">
                  <Heart size={18} className="text-recipes-dark" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-medium text-lg">{recipe.name}</h3>
                  <p className="text-white/80 text-sm">{recipe.description}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{recipe.time}</span>
                  </div>
                  <span className="text-xs bg-recipes-light text-recipes-dark px-2 py-1 rounded-full">
                    {recipe.difficulty}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Ingredienti:</h4>
                  <div className="flex flex-wrap gap-1">
                    {recipe.ingredients.map((ingredient, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded-full">
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button 
        className="fixed right-6 bottom-24 bg-recipes-DEFAULT text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Add new recipe"
      >
        <Plus size={24} />
      </button>
    </Layout>
  );
};

export default Recipes;
