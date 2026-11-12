import React from 'react';
import { Menu, Lock, Globe, Sun, Moon } from 'lucide-react';
import { SiteConfig, Language } from '../types';

interface HeaderProps {
  config: SiteConfig;
  lang: Language;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onToggleLang: () => void;
  onOpenAdmin: () => void;
  onOpenCustomAppModal: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  lang,
  theme,
  onToggleTheme,
  onToggleLang,
  onOpenAdmin,
  onOpenCustomAppModal,
  onToggleMobileMenu,
}) => {
  const isIt = lang === 'it';
  const payoff = config.payoff[lang] || config.payoff.it;

  return (
    <header className="lg:hidden sticky top-0 z-40 bg-[#0b1329] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative">
          <img
            src={config.logoUrl}
            alt={config.siteName}
            className="w-10 h-10 rounded-full object-cover border-2 border-orange-500 shadow-md ring-2 ring-orange-500/20"
          />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0b1329]" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-black tracking-tight font-heading text-white truncate">
            {config.siteName}
          </h1>
          <p className="text-[10px] text-slate-400 truncate">
            {payoff}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Theme switch (Chiaro / Scuro) */}
        <button
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:text-white transition"
          title={theme === 'dark' ? (isIt ? 'Passa a Tema Chiaro' : 'Switch to Light Mode') : (isIt ? 'Passa a Tema Scuro' : 'Switch to Dark Mode')}
          aria-label="Tema Chiaro/Scuro"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-300" />}
        </button>

        {/* Language switch */}
        <button
          onClick={onToggleLang}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 border border-slate-700 text-amber-400 hover:text-white transition"
          title="Cambia Lingua / Switch Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isIt ? 'IT' : 'EN'}</span>
        </button>

        {/* Admin Lock */}
        <button
          onClick={onOpenAdmin}
          className="p-1.5 rounded-lg bg-slate-800 text-amber-400 hover:text-white border border-slate-700 transition"
          title="Accedi al Pannello Admin (PIN: 8873)"
          aria-label="Admin"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Mobile menu hamburger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
