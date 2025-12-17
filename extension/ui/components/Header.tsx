/**
 * Header Component
 * Browser-like header with URL bar and navigation arrows
 * Futuristic dark theme with glassmorphism
 */

import React from 'react';

interface HeaderProps {
  currentUrl?: string;
  onBack?: () => void;
  onForward?: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUrl = 'https://www.example.com',
  onBack,
  onForward,
  canGoBack = false,
  canGoForward = false,
}) => {
  return (
    <header className="relative w-full bg-gradient-to-r from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md border-b border-cyan-500/20 shadow-lg shadow-cyan-500/10">
      <div className="flex items-center gap-2 px-4 py-3">
        {/* Navigation Arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={onBack}
            disabled={!canGoBack}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-700/50 hover:bg-slate-600/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30 hover:shadow-sm hover:shadow-cyan-500/20"
            aria-label="Go back"
          >
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={onForward}
            disabled={!canGoForward}
            className="flex items-center justify-center w-8 h-8 rounded-md bg-slate-700/50 hover:bg-slate-600/70 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 border border-cyan-500/10 hover:border-cyan-500/30 hover:shadow-sm hover:shadow-cyan-500/20"
            aria-label="Go forward"
          >
            <svg
              className="w-4 h-4 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* URL Bar */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={currentUrl}
            readOnly
            className="w-full px-4 py-2 pr-10 bg-slate-800/60 backdrop-blur-sm border border-cyan-500/20 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-200"
            aria-label="Current page URL"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-2 h-2 rounded-full bg-cyan-400/60 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
};

