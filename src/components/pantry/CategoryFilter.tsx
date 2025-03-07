
import { cn } from '@/lib/utils';
import { categoryIcons } from '@/utils/pantryUtils';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  mounted: boolean;
}

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, mounted }: CategoryFilterProps) => {
  return (
    <div className={cn("", mounted ? "opacity-100" : "opacity-0")} style={{ transitionDelay: '200ms', transition: 'all 0.5s ease-out' }}>
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(category => {
          const CategoryIcon = categoryIcons[category];
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "px-3 py-1 rounded-full text-sm whitespace-nowrap transition-all flex items-center space-x-1",
                isSelected 
                  ? "bg-pantry-light text-pantry-DEFAULT font-medium border-2 border-pantry-DEFAULT"
                  : "bg-secondary/70 text-muted-foreground hover:bg-secondary border-2 border-transparent"
              )}
            >
              {CategoryIcon && <CategoryIcon size={14} className={cn(
                "mr-1",
                isSelected ? "text-pantry-DEFAULT" : "text-muted-foreground"
              )} />}
              <span className={cn(
                isSelected ? "text-pantry-DEFAULT" : "text-muted-foreground"
              )}>{category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;
