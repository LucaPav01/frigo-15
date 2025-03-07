
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
    
    // For all page types, just use the FRIGO logo without icons
    return (
      <img 
        src="/lovable-uploads/c7db1167-3723-42a2-b3c7-cbb5a6d828cb.png" 
        alt="FRIGO logo" 
        className="h-10" // Made slightly larger (was h-7)
      />
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
