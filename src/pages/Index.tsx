
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ShoppingCart, Users, Apple, ChefHat, Refrigerator } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  const sections = [
    {
      title: 'Dispensa',
      description: 'Gestisci il tuo cibo e monitora le scadenze',
      icon: Refrigerator,
      color: 'pantry',
      path: '/pantry',
      delay: 100
    },
    {
      title: 'Ricette',
      description: 'Scopri ricette in base agli ingredienti disponibili',
      icon: ChefHat,
      color: 'recipes',
      path: '/recipes',
      delay: 200
    },
    {
      title: 'Dieta',
      description: 'Monitora le tue abitudini alimentari',
      icon: Apple,
      color: 'habits',
      path: '/habits',
      delay: 300
    },
    {
      title: 'Community',
      description: 'Condividi ricette e partecipa alle sfide',
      icon: Users,
      color: 'community',
      path: '/community',
      delay: 400
    },
    {
      title: 'Lista della Spesa',
      description: 'Organizza la tua lista della spesa',
      icon: ShoppingCart,
      color: 'shopping',
      path: '/shopping',
      delay: 500
    }
  ];

  return (
    <Layout showHeader={true} showBottomNav={true} showBackButton={false}>
      <div className="flex flex-col space-y-6 py-4">
        <div className={cn("space-y-2 transition-all duration-700", mounted ? "opacity-100" : "opacity-0 translate-y-4")}>
          <h1 className="text-3xl font-bold">Benvenuto</h1>
          <p className="text-muted-foreground">Gestisci il tuo viaggio alimentare, riduci gli sprechi e mangia in modo più sano.</p>
        </div>
        
        <div className="grid gap-4">
          {sections.map((section, i) => (
            <button
              key={section.path}
              onClick={() => navigate(section.path)}
              className={cn(
                "glass-card p-4 flex items-start space-x-4 transition-all duration-500 transform hover:translate-y-[-2px] active:translate-y-[0px]",
                mounted ? "opacity-100" : "opacity-0 translate-y-8"
              )}
              style={{ 
                transitionDelay: mounted ? `${section.delay}ms` : '0ms',
                borderLeftWidth: '4px',
                borderLeftColor: `var(--${section.color}-DEFAULT)`
              }}
            >
              <div className={`flex-shrink-0 p-3 rounded-full bg-${section.color}-light`}>
                <section.icon className={`text-${section.color}-dark`} size={24} />
              </div>
              <div className="text-left">
                <h2 className="font-medium">{section.title}</h2>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
