
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Refrigerator, Utensils, Scale, Users, ShoppingCart } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  showHeader?: boolean;
  showBottomNav?: boolean;
  showLogo?: boolean;
  customTitle?: ReactNode;
  pageType?: 'pantry' | 'recipes' | 'habits' | 'community' | 'shopping' | 'default';
}

const Layout = ({
  children,
  title,
  showBackButton = false,
  showHeader = true,
  showBottomNav = true,
  showLogo = true,
  customTitle,
  pageType = 'default'
}: LayoutProps) => {
  const location = useLocation();
  
  // Generate consistent header titles for different pages
  const getConsistentTitle = () => {
    if (customTitle) return customTitle;
    
    let icon = null;
    let text = title;
    let colorClass = '';
    
    switch (pageType) {
      case 'pantry':
        icon = <Refrigerator className="mr-2 text-pantry-DEFAULT" size={22} />;
        text = "Frigo";
        colorClass = 'text-pantry-DEFAULT';
        break;
      case 'shopping':
        icon = <ShoppingCart className="mr-2 text-shopping-DEFAULT" size={22} />;
        text = "Lista";
        colorClass = 'text-shopping-DEFAULT';
        break;
      case 'recipes':
        icon = <Utensils className="mr-2 text-recipes-DEFAULT" size={22} />;
        text = "Ricette";
        colorClass = 'text-recipes-DEFAULT';
        break;
      case 'habits':
        icon = <Scale className="mr-2 text-habits-DEFAULT" size={22} />;
        text = "Abitudini";
        colorClass = 'text-habits-DEFAULT';
        break;
      case 'community':
        icon = <Users className="mr-2 text-community-DEFAULT" size={22} />;
        text = "Community";
        colorClass = 'text-community-DEFAULT';
        break;
      default:
        return title ? <h1 className="text-lg font-medium">{title}</h1> : null;
    }
    
    return (
      <h1 className={`text-xl font-bold flex items-center ${colorClass}`} style={{ fontFamily: "Aileron, sans-serif" }}>
        {icon}
        {text}
      </h1>
    );
  };
  
  const headerTitle = getConsistentTitle();
  
  return (
    <div className="app-container">
      {showHeader && <Header title={title} showBackButton={showBackButton} showLogo={showLogo} customTitle={headerTitle} />}
      
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          timeout={350}
          classNames="page"
        >
          <main className="page-container">
            {children}
          </main>
        </CSSTransition>
      </TransitionGroup>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
};

export default Layout;
