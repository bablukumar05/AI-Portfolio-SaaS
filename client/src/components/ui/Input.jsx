import React from 'react';

const Input = ({
  label,
  type = "text",
  error,
  icon,
  className = "",
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && <label className="text-sm font-medium text-textMuted mb-2 block">{label}</label>}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textMuted">
            {icon}
          </div>
        )}
        <input
          type={type}
          className={`w-full bg-white dark:bg-dark-800 border ${error ? 'border-red-500' : 'border-slate-300 dark:border-white/10'} rounded-lg p-3 text-slate-900 dark:text-white focus:outline-none focus:border-primary transition-colors ${icon ? 'pl-10' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-red-400 text-xs mt-1 block">{error}</span>}
    </div>
  );
};

export default Input;
