
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Users, Apple, ChefHat, Refrigerator } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    {
      name: 'Dispensa',
      path: '/pantry',
      icon: Refrigerator,
      color: 'pantry'
    },
    {
      name: 'Ricette',
      path: '/recipes',
      icon: ChefHat,
      color: 'recipes'
    },
    {
      name: 'Abitudini',
      path: '/habits',
      icon: Apple,
      color: 'habits'
    },
    {
      name: 'Community',
      path: '/community',
      icon: Users,
      color: 'community'
    },
    {
      name: 'Lista',
      path: '/shopping',
      icon: ShoppingCart,
      color: 'shopping'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const colorClass = `text-${item.color}-${isActive ? 'dark' : 'DEFAULT'}`;
        const iconSizeClass = isActive ? 'scale-110' : 'scale-100';
        
        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className="nav-item group"
            aria-label={item.name}
          >
            <item.icon 
              className={cn(
                "nav-icon transform", 
                iconSizeClass,
                colorClass
              )} 
              size={22} 
            />
            <span 
              className={cn(
                "nav-text", 
                colorClass,
                isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
              )}
            >
              {item.name}
            </span>
            
            {isActive && (
              <span 
                className={cn(
                  "nav-indicator",
                  `bg-${item.color}-dark`
                )}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
