
import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

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
    
    // For all page types, display both the icon and logo
    return (
      <div className="flex items-center gap-2">
        <img 
          src="/lovable-uploads/ba77efae-72a4-4b45-9289-7a586fc4d01d.png" 
          alt="FRIGO icon" 
          className="h-7" 
        />
        <img 
          src="/lovable-uploads/c7db1167-3723-42a2-b3c7-cbb5a6d828cb.png" 
          alt="FRIGO logo" 
          className="h-11" 
        />
      </div>
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
