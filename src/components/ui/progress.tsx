
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string
    variant?: "default" | "circular"
    size?: "sm" | "md" | "lg"
    value: number
    max?: number
    showValue?: boolean
    label?: string
    thickness?: number
  }
>(({ 
  className, 
  value = 0, 
  max = 100,
  variant = "default",
  size = "md",
  indicatorClassName,
  showValue = false,
  label,
  thickness = 4,
  ...props 
}, ref) => {
  const percentage = (value / max) * 100;
  
  if (variant === "circular") {
    // Calculate circle properties
    const sizeMap = {
      sm: 60,
      md: 100,
      lg: 140
    };
    const actualSize = sizeMap[size];
    const center = actualSize / 2;
    const radius = center - thickness;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    
    return (
      <div className={cn("relative flex flex-col items-center justify-center", className)}>
        <svg
          width={actualSize}
          height={actualSize}
          viewBox={`0 0 ${actualSize} ${actualSize}`}
          className="transform rotate-[-90deg]"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            className="text-muted opacity-20"
          />
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={thickness}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-300 ease-in-out", indicatorClassName)}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          {showValue && (
            <span className={cn(
              "font-semibold",
              size === "sm" ? "text-2xl" : size === "md" ? "text-3xl" : "text-4xl"
            )}>
              {value}
            </span>
          )}
          {label && (
            <span className={cn(
              "text-muted-foreground",
              size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
            )}>
              {label}
            </span>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorClassName
        )}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
