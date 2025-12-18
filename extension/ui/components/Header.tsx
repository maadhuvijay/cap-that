/**
 * Header Component
 * Browser-like header with title "CapThat!"
 * Styled with Tailwind dark mode, glassmorphism effects, teal/cyan accents
 * 
 * Task: T034 - Create Header component at extension/ui/components/Header.tsx
 */

import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header
      className={`glass-panel w-full px-6 py-4 border-b border-teal-500/20 shadow-lg shadow-teal-500/10 ${className}`}
    >
      <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
        CapThat!
      </h1>
    </header>
  );
};

