
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
}

const Layout = ({
  children,
  title,
  showBackButton = false,
  showHeader = true,
  showBottomNav = true,
  showLogo = true,
  customTitle
}: LayoutProps) => {
  const location = useLocation();
  
  return (
    <div className="app-container">
      {showHeader && <Header title={title} showBackButton={showBackButton} showLogo={showLogo} customTitle={customTitle} />}
      
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
