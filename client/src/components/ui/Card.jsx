import React from 'react';

const Card = ({ children, className = "", onClick, ...props }) => {
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={onClick}
      className={`glass-card p-6 border border-white/5 bg-dark-900/50 rounded-xl ${isClickable ? 'cursor-pointer hover:border-primary/50 transition-colors' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
