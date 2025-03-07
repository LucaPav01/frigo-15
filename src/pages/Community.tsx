
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { Medal, Trophy, Star, Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mockup data for demonstration
const mockChallenges = [
  { 
    id: 1, 
    name: 'Zero Sprechi', 
    description: 'Non buttare cibo per 7 giorni',
    progress: 60,
    points: 50,
    participants: 245
  },
  { 
    id: 2, 
    name: 'Mangia Verde', 
    description: 'Consuma 5 porzioni di verdura al giorno',
    progress: 40,
    points: 30,
    participants: 189
  }
];

const mockLeaderboard = [
  { id: 1, name: 'Giulia M.', points: 1250, avatar: 'https://randomuser.me/api/portraits/women/32.jpg' },
  { id: 2, name: 'Marco L.', points: 1120, avatar: 'https://randomuser.me/api/portraits/men/47.jpg' },
  { id: 3, name: 'Sofia R.', points: 980, avatar: 'https://randomuser.me/api/portraits/women/26.jpg' },
];

const mockRecipes = [
  { 
    id: 1, 
    name: 'Insalata di Quinoa', 
    user: 'Laura B.',
    userAvatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    image: 'https://source.unsplash.com/random/300x200/?quinoa',
    likes: 42,
    comments: 7
  },
  { 
    id: 2, 
    name: 'Smoothie Verde', 
    user: 'Davide T.',
    userAvatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    image: 'https://source.unsplash.com/random/300x200/?smoothie',
    likes: 28,
    comments: 4
  }
];

const Community = () => {
  const [challenges, setChallenges] = useState(mockChallenges);
  const [leaderboard, setLeaderboard] = useState(mockLeaderboard);
  const [recipes, setRecipes] = useState(mockRecipes);
  const [userPoints, setUserPoints] = useState(650);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return (
    <Layout title="Community" showBackButton={true} showLogo={false}>
      <div className="space-y-6">
        <div className={cn("glass-card p-4", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">I tuoi punti</h3>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="text-yellow-500" size={16} fill="#EAB308" />
                <span className="text-xl font-bold">{userPoints}</span>
              </div>
            </div>
            <button className="bg-community-light text-community-dark px-3 py-1 rounded-full text-sm font-medium">
              Riscatta premi
            </button>
          </div>
        </div>

        <div className={cn("space-y-1", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Sfide attive</h3>
            <button className="text-sm text-community-DEFAULT">Vedi tutte</button>
          </div>
          
          <div className="space-y-3 mt-3">
            {challenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className={cn(
                  "glass-card p-4 transition-all duration-300",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{challenge.name}</h4>
                    <p className="text-sm text-muted-foreground">{challenge.description}</p>
                  </div>
                  <div className="flex items-center space-x-1 bg-community-light text-community-dark px-2 py-1 rounded-full">
                    <Trophy size={14} />
                    <span className="text-xs font-medium">{challenge.points} pt</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>{challenge.progress}% completato</span>
                    <span>{challenge.participants} partecipanti</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-community-DEFAULT h-full transition-all duration-1000 ease-out"
                      style={{ width: `${challenge.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("space-y-1", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '500ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Classifica</h3>
            <button className="text-sm text-community-DEFAULT">Vedi tutti</button>
          </div>
          
          <div className="glass-card p-3 mt-3">
            {leaderboard.map((user, index) => (
              <div 
                key={user.id}
                className={cn(
                  "flex items-center justify-between p-2 rounded-lg transition-all duration-300",
                  index < leaderboard.length - 1 ? "border-b border-gray-100" : "",
                  index === 0 ? "bg-yellow-50" : ""
                )}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold",
                    index === 0 ? "bg-yellow-500 text-white" : 
                    index === 1 ? "bg-gray-300 text-gray-700" :
                    index === 2 ? "bg-amber-600 text-white" : "bg-gray-200 text-gray-700"
                  )}>
                    {index + 1}
                  </div>
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-medium">{user.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Star className="text-yellow-500" size={14} fill="#EAB308" />
                  <span className="font-medium">{user.points}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn("space-y-1", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '700ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Ricette dalla community</h3>
            <button className="text-sm text-community-DEFAULT">Vedi tutte</button>
          </div>
          
          <div className="space-y-4 mt-3">
            {recipes.map((recipe, index) => (
              <div 
                key={recipe.id}
                className={cn(
                  "glass-card overflow-hidden transition-all duration-300",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className="relative h-40">
                  <img 
                    src={recipe.image} 
                    alt={recipe.name} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    loading="lazy"
                  />
                </div>
                
                <div className="p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <img src={recipe.userAvatar} alt={recipe.user} className="w-6 h-6 rounded-full object-cover" />
                    <span className="text-sm">{recipe.user}</span>
                  </div>
                  
                  <h4 className="font-medium mb-2">{recipe.name}</h4>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <button className="flex items-center space-x-1 transition-colors hover:text-community-dark">
                      <Heart size={16} />
                      <span>{recipe.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 transition-colors hover:text-community-dark">
                      <MessageCircle size={16} />
                      <span>{recipe.comments}</span>
                    </button>
                    
                    <button className="flex items-center space-x-1 ml-auto transition-colors hover:text-community-dark">
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button 
        className="fixed right-6 bottom-24 bg-community-DEFAULT text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Share recipe or experience"
      >
        <Plus size={24} />
      </button>
    </Layout>
  );
};

export default Community;
