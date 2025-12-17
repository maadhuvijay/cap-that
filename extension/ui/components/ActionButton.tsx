/**
 * ActionButton Component
 * Reusable button with hover states and micro-interactions
 * Futuristic styling with teal/cyan accents
 */

import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  className = '',
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-cyan-500/90 to-teal-500/90 hover:from-cyan-400 hover:to-teal-400 text-white border border-cyan-400/30 hover:border-cyan-300/50 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/30 focus:ring-cyan-500',
    secondary:
      'bg-slate-700/60 hover:bg-slate-600/80 text-slate-200 border border-slate-600/50 hover:border-slate-500/70 shadow-md shadow-slate-900/50 hover:shadow-lg focus:ring-slate-500',
    danger:
      'bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-500 hover:to-rose-500 text-white border border-red-500/30 hover:border-red-400/50 shadow-lg shadow-red-500/20 hover:shadow-red-400/30 focus:ring-red-500',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-label={label}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

