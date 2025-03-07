
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  customTitle?: React.ReactNode;
}

const Header = ({ title, showBackButton = false, showLogo = true, customTitle }: HeaderProps) => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-lg z-50 flex items-center justify-between px-4 border-b border-gray-100">
      <div className="flex items-center h-full">
        {showBackButton && (
          <button 
            onClick={handleBackClick}
            className="mr-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft size={20} />
          </button>
        )}
        {customTitle || (title && <h1 className="text-lg font-medium">{title}</h1>)}
      </div>
      
      {showLogo && (
        <button 
          onClick={handleLogoClick} 
          className="flex items-center transition-opacity hover:opacity-80"
          aria-label="Go to home screen"
        >
          <img 
            src="/lovable-uploads/c7db1167-3723-42a2-b3c7-cbb5a6d828cb.png" 
            alt="FRIGO logo" 
            className="h-10" // Made slightly larger (was h-8)
          />
        </button>
      )}
    </header>
  );
};

export default Header;
