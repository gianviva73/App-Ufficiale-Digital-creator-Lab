import React from 'react';
import { ArrowRight, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { SiteConfig, Language } from '../types';

interface HeroBannerProps {
  config: SiteConfig;
  lang: Language;
  onExploreOffers: () => void;
  onOpenCustomAppModal: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  config,
  lang,
  onExploreOffers,
  onOpenCustomAppModal,
}) => {
  const { heroBanner } = config;
  if (!heroBanner || !heroBanner.isVisible) return null;

  const isIt = lang === 'it';
  const title = heroBanner.title[lang] || heroBanner.title.it;
  const subtitle = heroBanner.subtitle[lang] || heroBanner.subtitle.it;
  const badge = heroBanner.badge[lang] || heroBanner.badge.it;
  const buttonText = heroBanner.buttonText[lang] || heroBanner.buttonText.it;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#0b1329] border border-slate-800 text-white shadow-xl">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Decorative subtle grid */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="max-w-2xl space-y-4 text-center lg:text-left">
          {badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{badge}</span>
            </div>
          )}

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight leading-tight text-white">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
            <button
              onClick={onExploreOffers}
              className="px-6 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-orange-600/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
            >
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] active:scale-[0.98] transition flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>{isIt ? 'Canale WhatsApp App Gratis' : 'Free Apps WhatsApp Channel'}</span>
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{isIt ? 'Offerte Verificate' : 'Verified Deals'}</span>
            </span>
            <span className="text-slate-600">•</span>
            <span>{isIt ? 'Nessuna Foto Invasiva' : 'No Intrusive Photos'}</span>
            <span className="text-slate-600">•</span>
            <span>{isIt ? 'Link Ufficiali Amazon' : 'Official Amazon Links'}</span>
          </div>
        </div>

        {/* Right Graphic badge/stat card */}
        <div className="shrink-0 w-full sm:w-72 bg-slate-900/80 backdrop-blur-md rounded-3xl p-5 border border-slate-700/80 shadow-2xl text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-orange-500 to-blue-600 p-0.5 shadow-lg">
            <img
              src={config.logoUrl}
              alt={config.siteName}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-heading">{config.siteName}</div>
            <div className="text-[11px] text-amber-400 font-semibold">{isIt ? 'Laboratorio Digitale Ufficiale' : 'Official Digital Lab'}</div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800">
            <div className="bg-slate-800/80 p-2.5 rounded-xl">
              <div className="text-lg font-black text-white">100%</div>
              <div className="text-[10px] text-slate-400 uppercase">{isIt ? 'Gratuito' : 'Free Access'}</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl">
              <div className="text-lg font-black text-orange-400">⚡ TOP</div>
              <div className="text-[10px] text-slate-400 uppercase">{isIt ? 'Sconti Reali' : 'Real Discounts'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
