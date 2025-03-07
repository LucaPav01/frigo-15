
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

// Preload the logo image to prevent loading delay
const logoImage = new Image();
logoImage.src = "/lovable-uploads/6c40864a-f7a1-4666-a0f0-435c2b0de7f1.png";

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
    
    // For all page types, display the new logo
    return (
      <div className="flex items-center">
        <img 
          src="/lovable-uploads/6c40864a-f7a1-4666-a0f0-435c2b0de7f1.png" 
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
