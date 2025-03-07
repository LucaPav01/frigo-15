
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { RefreshCw, ScanLine, Plus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mockup data for demonstration
const mockItems = [
  { id: 1, name: 'Latte', category: 'Dairy', expiration: '2023-12-15', quantity: 1, expiringStatus: 'soon' },
  { id: 2, name: 'Uova', category: 'Dairy', expiration: '2023-12-20', quantity: 6, expiringStatus: 'ok' },
  { id: 3, name: 'Pane', category: 'Bakery', expiration: '2023-12-10', quantity: 1, expiringStatus: 'critical' },
  { id: 4, name: 'Mele', category: 'Fruits', expiration: '2023-12-18', quantity: 4, expiringStatus: 'ok' },
  { id: 5, name: 'Pollo', category: 'Meat', expiration: '2023-12-12', quantity: 1, expiringStatus: 'soon' }
];

const categories = ['All', 'Dairy', 'Bakery', 'Fruits', 'Vegetables', 'Meat', 'Grains'];

const Pantry = () => {
  const [items, setItems] = useState(mockItems);
  const [selectedCategory, setSelectedCategory] = useState('All');
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

  const filteredItems = selectedCategory === 'All' 
    ? items 
    : items.filter(item => item.category === selectedCategory);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'bg-red-500';
      case 'soon': return 'bg-amber-500';
      default: return 'bg-green-500';
    }
  };

  const handleScan = () => {
    console.log('Scanning QR code');
    // Implement QR code scanning
  };

  return (
    <Layout title="Dispensa" showBackButton={true} showLogo={false}>
      <div className="space-y-6">
        <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <input 
              type="text" 
              placeholder="Cerca ingredienti..." 
              className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
        </div>

        <div className={cn("", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all",
                  selectedCategory === category 
                    ? "bg-pantry-DEFAULT text-white font-medium"
                    : "bg-secondary/70 text-muted-foreground hover:bg-secondary"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <RefreshCw className="animate-spin text-muted-foreground" size={24} />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                className={cn(
                  "glass-card p-4 flex items-center justify-between transition-all duration-300 animate-fade-in",
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn("w-2 h-12 rounded-full", getStatusColor(item.expiringStatus))} />
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-xs text-muted-foreground">Scade il {new Date(item.expiration).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-secondary rounded-md text-xs font-medium">
                    {item.quantity} {item.quantity > 1 ? 'pezzi' : 'pezzo'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button 
        onClick={handleScan}
        className="fixed right-6 bottom-24 bg-pantry-DEFAULT text-white p-4 rounded-full shadow-lg transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Scan QR code"
      >
        <ScanLine size={24} />
      </button>
      <button
        className="fixed left-6 bottom-24 bg-white text-pantry-dark border border-pantry-light p-4 rounded-full shadow-sm transform transition-transform hover:scale-105 active:scale-95"
        aria-label="Add item manually"
      >
        <Plus size={24} />
      </button>
    </Layout>
  );
};

export default Pantry;
