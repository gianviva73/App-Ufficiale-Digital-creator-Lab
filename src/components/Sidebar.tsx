import React from 'react';
import {
  Home,
  Tag,
  Zap,
  Grid,
  Smartphone,
  Lightbulb,
  FolderDown,
  ShoppingBag,
  Share2,
  PhoneCall,
  Lock,
  Globe,
  Sparkles,
  X,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { SiteConfig, Language, NavSection, Category } from '../types';

interface SidebarProps {
  config: SiteConfig;
  lang: Language;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  categories: Category[];
  offersCount: number;
  flashDealsCount: number;
  appsCount: number;
  ideasCount: number;
  resourcesCount: number;
  onToggleLang: () => void;
  onOpenAdmin: () => void;
  onOpenCustomAppModal: () => void;
  mobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  lang,
  theme,
  onToggleTheme,
  activeSection,
  onSelectSection,
  categories,
  offersCount,
  flashDealsCount,
  appsCount,
  ideasCount,
  resourcesCount,
  onToggleLang,
  onOpenAdmin,
  onOpenCustomAppModal,
  mobileMenuOpen,
  onCloseMobileMenu,
}) => {
  const isIt = lang === 'it';
  const payoff = config.payoff[lang] || config.payoff.it;

  const navItems: {
    id: NavSection;
    label: string;
    icon: React.ReactNode;
    count?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'home',
      label: isIt ? 'Home' : 'Home',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'offerte',
      label: isIt ? 'Offerte Amazon' : 'Amazon Offers',
      icon: <Tag className="w-4 h-4" />,
      count: offersCount,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
    {
      id: 'offerte-lampo',
      label: isIt ? 'Offerte Lampo' : 'Flash Deals',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      count: flashDealsCount,
      badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse',
    },
    {
      id: 'categorie',
      label: isIt ? 'Categorie' : 'Categories',
      icon: <Grid className="w-4 h-4" />,
      count: categories.filter((c) => c.isVisible !== false).length,
    },
    {
      id: 'app',
      label: isIt ? 'App Gratuite' : 'Free Apps',
      icon: <Smartphone className="w-4 h-4 text-emerald-400" />,
      count: appsCount,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    },
    {
      id: 'idee',
      label: isIt ? 'Idee Digitali' : 'Digital Ideas',
      icon: <Lightbulb className="w-4 h-4 text-yellow-300" />,
      count: ideasCount,
    },
    {
      id: 'risorse',
      label: isIt ? 'Risorse Digitali' : 'Digital Resources',
      icon: <FolderDown className="w-4 h-4 text-blue-400" />,
      count: resourcesCount,
    },
    {
      id: 'servizi',
      label: isIt ? 'Amazon & Servizi' : 'Amazon Services',
      icon: <ShoppingBag className="w-4 h-4 text-sky-400" />,
      count: '9',
    },
    {
      id: 'social',
      label: isIt ? 'I Miei Social' : 'My Socials',
      icon: <Share2 className="w-4 h-4 text-indigo-400" />,
    },
    {
      id: 'contatti',
      label: isIt ? 'Contatti' : 'Contact',
      icon: <PhoneCall className="w-4 h-4 text-green-400" />,
    },
  ];

  const handleNavClick = (section: NavSection) => {
    onSelectSection(section);
    onCloseMobileMenu();
    // Smooth scroll to target section if on home
    const el = document.getElementById(section);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-xs transition-opacity"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-72 h-screen bg-[#0b1329] text-slate-200 border-r border-slate-800/80 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header inside Sidebar */}
        <div className="p-5 flex-1 overflow-y-auto custom-dark-scrollbar">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/90">
            <div className="flex items-center gap-3">
              {/* Strictly Circular Logo with ring */}
              <div className="relative group cursor-pointer" onClick={() => handleNavClick('home')}>
                <img
                  src={config.logoUrl}
                  alt={config.siteName}
                  className="w-13 h-13 rounded-full object-cover border-2 border-orange-500 shadow-xl ring-4 ring-orange-500/10 group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#0b1329]" />
              </div>
              <div>
                <h2 
                  onClick={() => handleNavClick('home')}
                  className="text-base font-extrabold text-white tracking-wide font-heading leading-tight hover:text-orange-400 transition cursor-pointer"
                >
                  {config.siteName}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    LAB PRO
                  </span>
                  <span className="text-[10px] text-slate-400">v2.6</span>
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Chiudi menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Payoff description */}
          <p className="text-xs text-slate-400 mt-3 leading-relaxed font-normal">
            {payoff}
          </p>

          {/* Language, Theme and Admin Bar */}
          <div className="mt-4 p-2 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between gap-1.5 shadow-inner">
            {/* Bilingual toggle */}
            <div className="flex items-center gap-0.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
              <button
                onClick={() => lang !== 'it' && onToggleLang()}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  isIt
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Italiano"
              >
                IT
              </button>
              <button
                onClick={() => lang !== 'en' && onToggleLang()}
                className={`px-2 py-1 text-xs font-bold rounded-lg transition ${
                  !isIt
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="English"
              >
                EN
              </button>
            </div>

            {/* Theme Toggle (Chiaro / Scuro) */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800/80 text-amber-400 hover:text-white transition flex items-center gap-1"
              title={theme === 'dark' ? (isIt ? 'Passa a Chiaro' : 'Light Mode') : (isIt ? 'Passa a Scuro' : 'Dark Mode')}
              aria-label="Tema Chiaro/Scuro"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-300" />}
              <span className="text-[10px] font-bold hidden sm:inline">{theme === 'dark' ? (isIt ? 'Chiaro' : 'Light') : (isIt ? 'Scuro' : 'Dark')}</span>
            </button>

            {/* Admin Lock Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition shadow-sm shrink-0"
              title={isIt ? 'Accedi al Pannello Admin (Codice: 8873)' : 'Open Admin Panel (PIN: 8873)'}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>ADMIN</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-5 space-y-1">
            <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-400">
              {isIt ? 'Navigazione Principale' : 'Main Navigation'}
            </div>
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition group ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-md shadow-orange-600/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.count !== undefined && item.count !== null && (
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        item.badgeColor
                          ? item.badgeColor
                          : isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Custom App Banner */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800/90 space-y-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500/15 via-amber-500/10 to-transparent border border-orange-500/30">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
              <span>{isIt ? 'White-Label & Custom' : 'White-Label & Custom'}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-300 leading-snug">
              {isIt
                ? 'Vuoi un portale identico con il tuo logo e le tue offerte?'
                : 'Want an identical portal with your logo and deals?'}
            </p>
            <button
              onClick={() => {
                onOpenCustomAppModal();
                onCloseMobileMenu();
              }}
              className="mt-2.5 w-full py-2 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-md transition flex items-center justify-center gap-1.5"
            >
              <span>{isIt ? 'VUOI UN\'APP COSÌ?' : 'WANT AN APP LIKE THIS?'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          <div className="text-[10px] text-center text-slate-400">
            Digital Creator Lab © {new Date().getFullYear()}
          </div>
        </div>
      </aside>
    </>
  );
};
