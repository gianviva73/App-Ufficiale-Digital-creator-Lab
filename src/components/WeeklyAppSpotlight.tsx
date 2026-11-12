import React from 'react';
import { Smartphone, Sparkles, ExternalLink, ArrowRight } from 'lucide-react';
import { SiteConfig, Language } from '../types';

interface WeeklyAppSpotlightProps {
  config: SiteConfig;
  lang: Language;
}

export const WeeklyAppSpotlight: React.FC<WeeklyAppSpotlightProps> = ({
  config,
  lang,
}) => {
  const { freeAppOfTheWeek } = config;
  if (!freeAppOfTheWeek || !freeAppOfTheWeek.isVisible) return null;

  const isIt = lang === 'it';
  const title = freeAppOfTheWeek.title[lang] || freeAppOfTheWeek.title.it;
  const description = freeAppOfTheWeek.description[lang] || freeAppOfTheWeek.description.it;
  const badge = freeAppOfTheWeek.badge[lang] || freeAppOfTheWeek.badge.it;
  const buttonText = freeAppOfTheWeek.buttonText[lang] || freeAppOfTheWeek.buttonText.it;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-[#0b1329] border-2 border-emerald-500/30 p-6 sm:p-8 shadow-lg">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-3 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-300" />
            <span>{badge}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black font-heading text-white tracking-tight">
            {title}
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
            {description}
          </p>

          <div className="pt-1 flex items-center justify-center lg:justify-start gap-3 text-xs text-emerald-400 font-semibold">
            <span>✓ {isIt ? 'Nessuna registrazione richiesta' : 'No registration required'}</span>
            <span>•</span>
            <span>✓ {isIt ? '100% Gratuita e Leggera' : '100% Free & Lightweight'}</span>
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <a
            href={freeAppOfTheWeek.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>{buttonText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <a
            href="https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase tracking-wider border border-slate-700 transition flex items-center gap-2"
          >
            <span>{isIt ? 'Canale WhatsApp' : 'WhatsApp Channel'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
