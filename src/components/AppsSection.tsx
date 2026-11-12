import React from 'react';
import { Smartphone, ExternalLink, Sparkles, MessageCircle } from 'lucide-react';
import { FreeApp, Category, Language } from '../types';

interface AppsSectionProps {
  apps: FreeApp[];
  categories: Category[];
  lang: Language;
}

export const AppsSection: React.FC<AppsSectionProps> = ({
  apps,
  categories,
  lang,
}) => {
  const isIt = lang === 'it';
  const visibleApps = apps.filter((a) => a.isPublished !== false);

  return (
    <section id="app" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/90 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <Smartphone className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              {isIt ? 'Applicazioni Gratuite del Lab' : 'Free Lab Web Applications'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isIt
              ? 'Strumenti e utility web leggeri, gratuiti al 100%, subito pronti per essere utilizzati da browser.'
              : 'Lightweight web tools and utilities, 100% free and ready to use in your browser.'}
          </p>
        </div>

        <a
          href="https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black uppercase tracking-wider shadow-sm transition self-start sm:self-auto"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>{isIt ? 'Canale WhatsApp Ufficiale' : 'Official WhatsApp Channel'}</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleApps.map((item) => {
          const title = item.title[lang] || item.title.it;
          const description = item.description[lang] || item.description.it;
          const badge = item.badge ? item.badge[lang] || item.badge.it : null;
          const category = categories.find((c) => c.id === item.categoryId);
          const categoryName = category ? category.name[lang] || category.name.it : null;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-600 shadow-xs hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {categoryName ? (
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {categoryName}
                    </span>
                  ) : (
                    <span />
                  )}

                  {badge && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      <span>{badge}</span>
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading leading-snug">
                  {title}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <a
                  href={item.destinationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm hover:shadow transition"
                >
                  <span>{isIt ? 'Apri Applicazione Gratuita' : 'Launch Free Web App'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
