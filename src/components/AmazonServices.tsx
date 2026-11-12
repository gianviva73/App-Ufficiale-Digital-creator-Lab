import React from 'react';
import {
  Zap,
  Music,
  Headphones,
  BookOpen,
  Camera,
  Film,
  Smile,
  Briefcase,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { AmazonService, Language } from '../types';

interface AmazonServicesProps {
  services: AmazonService[];
  lang: Language;
}

export const AmazonServices: React.FC<AmazonServicesProps> = ({
  services,
  lang,
}) => {
  const isIt = lang === 'it';
  const visibleServices = [...services]
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const getServiceIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'zap':
        return <Zap className="w-5 h-5 text-amber-500" />;
      case 'music':
        return <Music className="w-5 h-5 text-emerald-500" />;
      case 'headphones':
        return <Headphones className="w-5 h-5 text-orange-500" />;
      case 'bookopen':
        return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'camera':
        return <Camera className="w-5 h-5 text-pink-500" />;
      case 'film':
        return <Film className="w-5 h-5 text-sky-500" />;
      case 'smile':
        return <Smile className="w-5 h-5 text-teal-500" />;
      case 'briefcase':
        return <Briefcase className="w-5 h-5 text-blue-500" />;
      case 'shoppingbag':
        return <ShoppingBag className="w-5 h-5 text-green-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <section id="servizi" className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/90 dark:border-slate-800 pb-3">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white font-heading flex items-center gap-2">
            <span className="text-orange-500">🛍️</span>
            <span>{isIt ? 'Amazon & Servizi Esclusivi' : 'Amazon & Exclusive Services'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isIt
              ? 'Accesso rapido ai vantaggi Prime, prove gratuite e programmi ufficiali.'
              : 'Direct access to Prime perks, free trials, and official affiliate programs.'}
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 self-start sm:self-auto border border-transparent dark:border-slate-700/60">
          {visibleServices.length} {isIt ? 'Servizi Attivi' : 'Active Services'}
        </span>
      </div>

      {/* Compact button grid - NO repeating 'Servizio', clean direct action pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {visibleServices.map((srv) => {
          const label = srv.label[lang] || srv.label.it;
          const badge = srv.badge ? srv.badge[lang] || srv.badge.it : null;

          return (
            <a
              key={srv.id}
              href={srv.url}
              target="_blank"
              rel="nofollow noopener sponsored"
              className="group relative flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-white dark:bg-slate-900 hover:bg-[#0b1329] dark:hover:bg-slate-800 border border-slate-200/90 dark:border-slate-800 hover:border-slate-800 shadow-xs hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
            >
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 group-hover:bg-slate-800/80 mb-2 transition">
                {getServiceIcon(srv.iconName)}
              </div>

              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-white transition leading-snug">
                {label}
              </span>

              {badge && (
                <span className="mt-2 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition">
                  {badge}
                </span>
              )}

              <ExternalLink className="absolute top-2.5 right-2.5 w-3 h-3 text-slate-300 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition" />
            </a>
          );
        })}
      </div>
    </section>
  );
};
