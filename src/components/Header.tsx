import React from 'react';
import { Sun, Moon, CloudSun } from 'lucide-react';
import type { Theme } from '../types';

interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
    return (
        <header className="w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/50 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                {/* Logo + Title */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 dark:from-emerald-500 dark:to-teal-700 flex items-center justify-center shadow-lg shadow-teal-500/20">
                        <CloudSun className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white leading-tight">
                            Morocco Weather Predictor
                        </h1>
                        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
                            Oct 1–5 · ML-Powered Forecast
                        </p>
                    </div>
                </div>

                {/* Right: Badge + Theme toggle */}
                <div className="flex items-center gap-3">
                    <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-700/50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Live Model
                    </span>
                    <button
                        onClick={onToggleTheme}
                        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95"
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4.5 h-4.5 w-[18px] h-[18px]" />
                        ) : (
                            <Moon className="w-[18px] h-[18px]" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
