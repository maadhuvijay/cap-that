/**
 * ActionButton Component
 * Reusable button component with states: default, hover, active, disabled
 * Keyboard accessible with smooth transitions
 * Styled with Tailwind CSS with teal/cyan accents
 * 
 * Task: T038 - Create ActionButton component at extension/ui/components/ActionButton.tsx
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
  type?: 'button' | 'submit' | 'reset';
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  className = '',
  type = 'button',
}) => {
  // Base styles: smooth transitions, keyboard accessibility
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-smooth focus-ring disabled:opacity-50 disabled:cursor-not-allowed';

  // State styles: default, hover, active, disabled
  const variantStyles = {
    primary:
      'bg-gradient-to-r from-teal-500/90 to-cyan-500/90 hover:from-teal-400 hover:to-cyan-400 active:from-teal-600 active:to-cyan-600 text-white border border-teal-400/30 hover:border-teal-300/50 active:border-teal-500/70 shadow-lg shadow-teal-500/20 hover:shadow-teal-400/30 active:shadow-teal-500/40 focus:ring-teal-500 disabled:from-teal-500/50 disabled:to-cyan-500/50',
    secondary:
      'bg-slate-700/60 hover:bg-slate-600/80 active:bg-slate-500/90 text-slate-200 border border-slate-600/50 hover:border-slate-500/70 active:border-slate-400/90 shadow-md shadow-slate-900/50 hover:shadow-lg active:shadow-xl focus:ring-slate-500 disabled:bg-slate-700/30',
    danger:
      'bg-gradient-to-r from-red-600/90 to-rose-600/90 hover:from-red-500 hover:to-rose-500 active:from-red-700 active:to-rose-700 text-white border border-red-500/30 hover:border-red-400/50 active:border-red-600/70 shadow-lg shadow-red-500/20 hover:shadow-red-400/30 active:shadow-red-500/40 focus:ring-red-500 disabled:from-red-600/50 disabled:to-rose-600/50',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        onClick();
      }
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      aria-label={label}
      aria-disabled={disabled}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

