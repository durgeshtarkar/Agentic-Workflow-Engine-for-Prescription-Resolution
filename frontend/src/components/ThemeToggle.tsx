import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <button
      onClick={toggleTheme}
      className={`
        flex items-center gap-3 p-2 rounded-[1.25rem] transition-all duration-300 group
        ${theme === 'dark' 
          ? 'bg-slate-900/50 text-sky-400 border border-slate-800' 
          : 'bg-slate-50 text-slate-600 border border-slate-100 hover:shadow-sm'
        }
      `}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className={`
        p-2 rounded-xl transition-all duration-500
        ${theme === 'dark' 
          ? 'bg-slate-900 shadow-[0_0_15px_rgba(56,189,248,0.2)] rotate-[360deg]' 
          : 'bg-white shadow-sm rotate-0'
        }
      `}>
        {theme === 'light' ? (
          <Moon size={16} className="text-slate-600 group-hover:fill-current transition-all" />
        ) : (
          <Sun size={16} className="text-sky-400 group-hover:scale-110 transition-all" />
        )}
      </div>
      <div className="flex flex-col items-start pr-4">
        <span className="text-[10px] font-black uppercase tracking-[0.1em] leading-none mb-0.5">
          {theme === 'light' ? 'Night' : 'Day'}
        </span>
        <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest whitespace-nowrap">
          Appearance
        </span>
      </div>
    </button>
  );
};

export default ThemeToggle;
