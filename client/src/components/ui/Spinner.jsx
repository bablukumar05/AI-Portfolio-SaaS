import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Spinner = ({ className, size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div className={cn("relative flex justify-center items-center", className)}>
       <div className={cn("rounded-full border-t-primary border-slate-300 dark:border-slate-700 animate-spin", sizeClasses[size])}></div>
    </div>
  );
};

export default Spinner;
