/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  loadDatabase,
  saveDatabase,
  loadStoredLanguage,
  saveStoredLanguage,
  loadStoredTheme,
  saveStoredTheme,
} from './storage';
import { AppDatabase, Language, NavSection } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SocialBar } from './components/SocialBar';
import { HeroBanner } from './components/HeroBanner';
import { WeeklyAppSpotlight } from './components/WeeklyAppSpotlight';
import { AmazonServices } from './components/AmazonServices';
import { AmazonOffers } from './components/AmazonOffers';
import { AppsSection } from './components/AppsSection';
import { IdeasResourcesSection } from './components/IdeasResourcesSection';
import { CustomAppModal } from './components/CustomAppModal';
import { AdminPanel } from './components/AdminPanel';
import { Sparkles, ArrowRight, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { generateStandaloneHtml } from './utils/exportSingleFile';

export default function App() {
  const [database, setDatabase] = useState<AppDatabase>(() => loadDatabase());
  const [lang, setLang] = useState<Language>(() => loadStoredLanguage());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => loadStoredTheme());
  const [activeSection, setActiveSection] = useState<NavSection>('home');
  const [isCustomAppModalOpen, setIsCustomAppModalOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Sync title, language and dark class to HTML
  useEffect(() => {
    document.title = `${database.config.siteName} | Offerte Amazon, App Gratuite e Risorse Digitali`;
    document.documentElement.lang = lang;
  }, [database.config.siteName, lang]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Theme toggle handler (Chiaro / Scuro)
  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    saveStoredTheme(nextTheme);
  };

  // Language toggle handler
  const handleToggleLang = () => {
    const nextLang = lang === 'it' ? 'en' : 'it';
    setLang(nextLang);
    saveStoredLanguage(nextLang);
  };

  // Database update handler
  const handleSaveDatabase = (updated: AppDatabase) => {
    setDatabase(updated);
    saveDatabase(updated);
  };

  const isIt = lang === 'it';
  const activeOffers = database.offers.filter((o) => o.isPublished !== false);
  const flashOffers = activeOffers.filter((o) => o.isFlashDeal);

  // Quick download standalone index.html
  const handleDownloadStandalone = () => {
    const htmlContent = generateStandaloneHtml(database);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#090d1a] text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      {/* Mobile Top Header */}
      <Header
        config={database.config}
        lang={lang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleLang={handleToggleLang}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenCustomAppModal={() => setIsCustomAppModalOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
      />

      {/* Dark Sidebar Navigation */}
      <Sidebar
        config={database.config}
        lang={lang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        activeSection={activeSection}
        onSelectSection={(sec) => setActiveSection(sec)}
        categories={database.categories}
        offersCount={activeOffers.length}
        flashDealsCount={flashOffers.length}
        appsCount={database.apps.filter((a) => a.isPublished !== false).length}
        ideasCount={database.ideas.filter((i) => i.isPublished !== false).length}
        resourcesCount={database.resources.filter((r) => r.isPublished !== false).length}
        onToggleLang={handleToggleLang}
        onOpenAdmin={() => setIsAdminPanelOpen(true)}
        onOpenCustomAppModal={() => setIsCustomAppModalOpen(true)}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-10 max-w-7xl">
        {/* Top Social Pill Bar */}
        <SocialBar
          socialLinks={database.socialLinks}
          lang={lang}
          onOpenCustomAppModal={() => setIsCustomAppModalOpen(true)}
        />

        {/* Hero Promotional Banner */}
        <HeroBanner
          config={database.config}
          lang={lang}
          onExploreOffers={() => {
            const el = document.getElementById('offerte');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenCustomAppModal={() => setIsCustomAppModalOpen(true)}
        />

        {/* Free App of the Week Spotlight */}
        <WeeklyAppSpotlight config={database.config} lang={lang} />

        {/* Amazon & Services Quick Buttons (Compact, no redundant words) */}
        <AmazonServices services={database.services} lang={lang} />

        {/* Amazon Offers (Strict Compliance: NO PRODUCT PHOTOS, prices + auto discounts) */}
        <AmazonOffers
          offers={database.offers}
          categories={database.categories}
          lang={lang}
          disclaimer={database.config.affiliateDisclaimer}
          initialFilter={activeSection === 'offerte-lampo' ? 'flash' : 'all'}
        />

        {/* Free Web Applications */}
        <AppsSection
          apps={database.apps}
          categories={database.categories}
          lang={lang}
        />

        {/* Ideas & Digital Downloads */}
        <IdeasResourcesSection
          ideas={database.ideas}
          resources={database.resources}
          categories={database.categories}
          lang={lang}
        />

        {/* Custom App Callout Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left max-w-xl">
            <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
              {isIt ? 'SOLUZIONE WHITE-LABEL' : 'WHITE-LABEL SOLUTION'}
            </span>
            <h3 className="text-xl sm:text-2xl font-black font-heading leading-tight">
              {isIt
                ? 'Vuoi un portale come DIGITAL CREATOR LAB con il tuo nome e le tue offerte?'
                : 'Want a portal like DIGITAL CREATOR LAB with your name and deals?'}
            </h3>
            <p className="text-xs sm:text-sm text-orange-100">
              {isIt
                ? 'Personalizzabile al 100%: logo circolare, colori aziendali, link affiliati e pannello ADMIN riservato.'
                : '100% customizable: circular logo, company branding, affiliate tags, and private ADMIN laboratory.'}
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => setIsCustomAppModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition flex items-center gap-2"
            >
              <span>{isIt ? 'VUOI UN\'APP COSÌ?' : 'WANT AN APP LIKE THIS?'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-200/90 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <img
              src={database.config.logoUrl}
              alt={database.config.siteName}
              className="w-6 h-6 rounded-full object-cover border border-orange-500"
            />
            <span className="font-bold text-slate-700 dark:text-slate-300">{database.config.siteName}</span>
            <span>© {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadStandalone}
              className="hover:text-orange-500 transition flex items-center gap-1 font-semibold"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isIt ? 'Scarica index.html autonomo' : 'Download standalone index.html'}</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAdminPanelOpen(true)}
              className="hover:text-slate-900 dark:hover:text-white transition font-semibold"
            >
              {isIt ? 'Pannello Admin' : 'Admin Panel'}
            </button>
          </div>
        </footer>
      </main>

      {/* "VUOI UN'APP COSÌ?" Modal Popup */}
      <CustomAppModal
        isOpen={isCustomAppModalOpen}
        onClose={() => setIsCustomAppModalOpen(false)}
        config={database.config}
        lang={lang}
      />

      {/* Reserved Admin Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        database={database}
        onSaveDatabase={handleSaveDatabase}
        lang={lang}
      />
    </div>
  );
}
