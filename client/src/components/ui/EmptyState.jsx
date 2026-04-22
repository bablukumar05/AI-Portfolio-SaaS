import { ReactNode } from "react";
import { cn } from "./Spinner";

const EmptyState = ({ title, description, icon, action, className }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center bg-white dark:bg-dark-800 rounded-xl border border-slate-200 dark:border-slate-800", className)}>
      {icon && <div className="mb-4 text-slate-400 dark:text-slate-500 text-6xl">{icon}</div>}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
