
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  searchQuery: string;
  onChange: (query: string) => void;
  mounted: boolean;
}

const SearchBar = ({ searchQuery, onChange, mounted }: SearchBarProps) => {
  return (
    <div className={cn("relative", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '100ms', transition: 'all 0.5s ease-out' }}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <input 
          type="text" 
          placeholder="Cerca ingredienti..." 
          className="w-full bg-secondary/70 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          value={searchQuery}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchBar;
