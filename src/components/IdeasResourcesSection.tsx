import React from 'react';
import { Lightbulb, FolderDown, ExternalLink, Download, FileText, CheckCircle2 } from 'lucide-react';
import { DigitalIdea, DigitalResource, Category, Language } from '../types';

interface IdeasResourcesSectionProps {
  ideas: DigitalIdea[];
  resources: DigitalResource[];
  categories: Category[];
  lang: Language;
}

export const IdeasResourcesSection: React.FC<IdeasResourcesSectionProps> = ({
  ideas,
  resources,
  categories,
  lang,
}) => {
  const isIt = lang === 'it';
  const visibleIdeas = ideas.filter((i) => i.isPublished !== false);
  const visibleResources = resources.filter((r) => r.isPublished !== false);

  return (
    <div className="space-y-12">
      {/* IDEE */}
      <section id="idee" className="space-y-6">
        <div className="border-b border-slate-200/90 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              {isIt ? 'Idee, Strategie & Progetti' : 'Digital Ideas & Strategies'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isIt
              ? 'Spunti operativi, modelli di crescita e architetture per canali digitali e creator.'
              : 'Actionable blueprints, growth strategies, and architecture for digital creators.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleIdeas.map((idea) => {
            const title = idea.title[lang] || idea.title.it;
            const description = idea.description[lang] || idea.description.it;

            return (
              <div
                key={idea.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    {idea.conceptTags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-200/60 dark:border-amber-500/30"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading leading-snug">
                    {title}
                  </h4>

                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>

                {idea.destinationUrl && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <a
                      href={idea.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
                    >
                      <span>{isIt ? 'Approfondisci sul canale' : 'Read more on channel'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* RISORSE DIGITALI */}
      <section id="risorse" className="space-y-6">
        <div className="border-b border-slate-200/90 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400">
              <FolderDown className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              {isIt ? 'Risorse Digitali & Download' : 'Digital Resources & Downloads'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isIt
              ? 'File, fogli di calcolo, modelli Google Drive e checklist per la gestione delle offerte.'
              : 'Files, spreadsheets, Google Drive templates, and deal management checklists.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleResources.map((res) => {
            const title = res.title[lang] || res.title.it;
            const description = res.description[lang] || res.description.it;

            return (
              <div
                key={res.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-6 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-500/30 uppercase tracking-wider">
                      {res.resourceType}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {res.fileInfo || 'Google Drive'}
                    </span>
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
                    href={res.destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isIt ? 'Accedi alla Risorsa (Drive)' : 'Access Resource (Drive)'}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
