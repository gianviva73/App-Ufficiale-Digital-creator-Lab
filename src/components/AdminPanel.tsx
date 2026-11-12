import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  X,
  Save,
  Plus,
  Trash2,
  Edit2,
  Check,
  Globe,
  Tag,
  Share2,
  Layers,
  Smartphone,
  FolderDown,
  ShoppingBag,
  Sliders,
  Database,
  Download,
  Upload,
  Copy,
  ExternalLink,
  AlertCircle,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  AppDatabase,
  Language,
  AmazonOffer,
  FreeApp,
  DigitalIdea,
  DigitalResource,
  Category,
  AmazonService,
  SocialLink,
} from '../types';
import { calculateDiscount, formatCurrency } from '../storage';
import { generateStandaloneHtml } from '../utils/exportSingleFile';
import confetti from 'canvas-confetti';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  database: AppDatabase;
  onSaveDatabase: (updated: AppDatabase) => void;
  lang: Language;
}

type AdminTab =
  | 'identity'
  | 'social'
  | 'offers'
  | 'categories'
  | 'apps'
  | 'ideas-resources'
  | 'services'
  | 'homepage'
  | 'compliance'
  | 'backend-export';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  database,
  onSaveDatabase,
  lang,
}) => {
  const isIt = lang === 'it';
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('offers');

  // Local draft of the database being modified
  const [draftDb, setDraftDb] = useState<AppDatabase>(database);
  const [successToast, setSuccessToast] = useState<string>('');

  // Editing state modals / subforms
  const [editingOffer, setEditingOffer] = useState<AmazonOffer | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingApp, setEditingApp] = useState<FreeApp | null>(null);
  const [editingIdea, setEditingIdea] = useState<DigitalIdea | null>(null);
  const [editingResource, setEditingResource] = useState<DigitalResource | null>(null);
  const [editingService, setEditingService] = useState<AmazonService | null>(null);

  if (!isOpen) return null;

  // Handle Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPass = draftDb.config.adminPassword || '8873';
    if (passwordInput.trim() === correctPass || passwordInput.trim() === '8873') {
      setIsAuthenticated(true);
      setAuthError('');
    } else {
      setAuthError(isIt ? 'Codice di sicurezza non valido. Accesso riservato.' : 'Invalid security code. Access restricted.');
    }
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const persistChanges = (newDb: AppDatabase, msg?: string) => {
    setDraftDb(newDb);
    onSaveDatabase(newDb);
    triggerToast(msg || (isIt ? 'Modifiche salvate con successo!' : 'Changes saved successfully!'));
  };

  // Download Standalone index.html
  const handleDownloadStandaloneHtml = () => {
    try {
      const htmlContent = generateStandaloneHtml(draftDb);
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'index.html';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      try {
        confetti({ particleCount: 50, spread: 60 });
      } catch {}
      triggerToast(isIt ? 'File index.html scaricato con successo!' : 'index.html downloaded successfully!');
    } catch (err) {
      alert('Errore durante la generazione di index.html: ' + err);
    }
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draftDb, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `digital_creator_lab_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    triggerToast(isIt ? 'Backup JSON scaricato!' : 'JSON Backup exported!');
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.config && parsed.offers) {
          persistChanges(parsed, isIt ? 'Backup ripristinato con successo!' : 'Backup restored successfully!');
        } else {
          alert('File JSON non valido per Digital Creator Lab.');
        }
      } catch {
        alert('Errore nella lettura del file JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Logo file upload -> base64
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated = {
          ...draftDb,
          config: { ...draftDb.config, logoUrl: reader.result },
        };
        persistChanges(updated, isIt ? 'Logo circolare aggiornato!' : 'Circular logo updated!');
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-6xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Admin Header Bar */}
        <div className="bg-[#0b1329] text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-heading text-white tracking-wide">
                  {isIt ? 'LABORATORIO ADMIN' : 'ADMIN WORKSHOP'}
                </h2>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {isAuthenticated ? (isIt ? 'Autenticato' : 'Authorized') : (isIt ? 'Protetto' : 'Protected')}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isIt ? 'Gestione completa offerte, contenuti, categorie e download index.html' : 'Manage deals, content, categories, and export index.html'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleDownloadStandaloneHtml}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider shadow-md transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isIt ? 'Scarica index.html' : 'Download index.html'}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Chiudi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="absolute top-16 right-6 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Content Area */}
        {!isAuthenticated ? (
          /* LOGIN SCREEN */
          <div className="p-8 sm:p-14 flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-xl">
              <Lock className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-black text-slate-900 font-heading">
                {isIt ? 'Accesso Riservato Amministratore' : 'Admin Restricted Access'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isIt
                  ? 'Accesso esclusivo protetto da codice di sicurezza. Inserisci il codice a 4 cifre per gestire il portale.'
                  : 'Exclusive access protected by security code. Enter your 4-digit PIN to manage the portal.'}
              </p>
              <div className="p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>{isIt ? 'Area Riservata — Solo Personale Autorizzato' : 'Restricted Area — Authorized Access Only'}</span>
              </div>
            </div>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-3">
              <div>
                <input
                  type="password"
                  placeholder={isIt ? 'Codice di Sicurezza (PIN)...' : 'Security PIN Code...'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-center font-bold tracking-widest"
                  maxLength={16}
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-red-600 font-semibold mt-1.5">{authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-lg transition"
              >
                {isIt ? 'ENTRA NEL LABORATORIO' : 'UNLOCK ADMIN'}
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN INTERFACE */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Admin Left Tabs Menu */}
            <aside className="w-full md:w-64 bg-slate-900 text-slate-300 p-4 border-r border-slate-800 shrink-0 overflow-y-auto space-y-1">
              <div className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1">
                {isIt ? 'Sezioni Laboratorio' : 'Workshop Tabs'}
              </div>

              {[
                { id: 'offers', label: isIt ? 'Offerte Amazon' : 'Amazon Deals', icon: <Tag className="w-4 h-4" />, count: draftDb.offers.length },
                { id: 'identity', label: isIt ? 'Identità & Brand' : 'Identity & Brand', icon: <Sliders className="w-4 h-4" /> },
                { id: 'social', label: isIt ? 'Social & WhatsApp' : 'Social & WhatsApp', icon: <Share2 className="w-4 h-4" /> },
                { id: 'categories', label: isIt ? 'Categorie' : 'Categories', icon: <Layers className="w-4 h-4" />, count: draftDb.categories.length },
                { id: 'apps', label: isIt ? 'App Gratuite' : 'Free Apps', icon: <Smartphone className="w-4 h-4" />, count: draftDb.apps.length },
                { id: 'ideas-resources', label: isIt ? 'Idee & Risorse' : 'Ideas & Resources', icon: <FolderDown className="w-4 h-4" /> },
                { id: 'services', label: isIt ? 'Amazon & Servizi' : 'Amazon Services', icon: <ShoppingBag className="w-4 h-4" />, count: draftDb.services.length },
                { id: 'homepage', label: isIt ? 'Homepage & Banner' : 'Home & Banner', icon: <Sparkles className="w-4 h-4" /> },
                { id: 'compliance', label: isIt ? 'Compliance & Lingue' : 'Compliance & Lang', icon: <Globe className="w-4 h-4" /> },
                { id: 'backend-export', label: isIt ? 'Backend & GitHub' : 'Backend & GitHub', icon: <Database className="w-4 h-4 text-emerald-400" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === tab.id
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </div>
                  {tab.count !== undefined && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isIt ? 'Blocca Laboratorio' : 'Lock Admin'}</span>
                </button>
              </div>
            </aside>

            {/* Admin Main Tab Content Area */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-slate-50">
              {/* TAB: OFFERS */}
              {activeTab === 'offers' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-heading">
                        {isIt ? 'Gestione Offerte Amazon (Senza Foto)' : 'Manage Amazon Deals (Photo-free)'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isIt
                          ? 'Rispetta la regola: nessuna foto caricata. Prezzi trasparenti e sconto automatico.'
                          : 'Strict compliance: zero images required. Transparent prices and automatic discount math.'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newOff: AmazonOffer = {
                          id: 'off-' + Date.now(),
                          title: { it: '', en: '' },
                          description: { it: '', en: '' },
                          previousPrice: null,
                          currentPrice: 0,
                          discountPercent: null,
                          affiliateLink: 'https://www.amazon.it/?tag=digitalcreatorlab-21',
                          categoryId: draftDb.categories[0]?.id || 'cat-tech',
                          isFlashDeal: false,
                          isFeatured: false,
                          isPublished: true,
                          createdAt: new Date().toISOString(),
                        };
                        setEditingOffer(newOff);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition self-start sm:self-auto"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isIt ? 'Nuova Offerta' : 'Add Deal'}</span>
                    </button>
                  </div>

                  {/* Offers List */}
                  <div className="space-y-3">
                    {draftDb.offers.map((offer) => {
                      const discount = calculateDiscount(offer.previousPrice, offer.currentPrice) || offer.discountPercent;
                      const cat = draftDb.categories.find((c) => c.id === offer.categoryId);

                      return (
                        <div
                          key={offer.id}
                          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              {cat && (
                                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                                  {cat.name[lang] || cat.name.it}
                                </span>
                              )}
                              {offer.isFlashDeal && (
                                <span className="text-[9px] font-black px-2 py-0.5 rounded bg-red-100 text-red-600">
                                  ⚡ LAMPO
                                </span>
                              )}
                              {offer.isFeatured && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                  TOP
                                </span>
                              )}
                              {!offer.isPublished && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-600">
                                  {isIt ? 'SOSPESA / BOZZA' : 'DRAFT'}
                                </span>
                              )}
                            </div>

                            <h5 className="text-sm font-bold text-slate-900 truncate">
                              {offer.title.it || offer.title.en || 'Senza titolo'}
                            </h5>
                            <p className="text-xs text-slate-500 truncate max-w-xl">
                              {offer.description.it || offer.description.en}
                            </p>
                          </div>

                          {/* Prices & Actions */}
                          <div className="flex items-center gap-4 shrink-0 self-end md:self-auto">
                            <div className="text-right">
                              <div className="text-sm font-black text-slate-900">
                                {formatCurrency(offer.currentPrice)}
                              </div>
                              {discount ? (
                                <div className="text-[11px] font-bold text-emerald-600">
                                  -{discount}%
                                </div>
                              ) : null}
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => setEditingOffer(offer)}
                                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                                title="Modifica"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(isIt ? 'Vuoi eliminare questa offerta?' : 'Delete this deal?')) {
                                    const filtered = draftDb.offers.filter((o) => o.id !== offer.id);
                                    persistChanges({ ...draftDb, offers: filtered }, isIt ? 'Offerta eliminata' : 'Deal deleted');
                                  }
                                }}
                                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition"
                                title="Elimina"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Edit Offer Modal */}
                  {editingOffer && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
                      <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl">
                        <div className="flex items-center justify-between border-b pb-3">
                          <h4 className="text-base font-black text-slate-900 font-heading">
                            {isIt ? 'Modifica / Nuova Offerta Amazon' : 'Edit Amazon Deal'}
                          </h4>
                          <button
                            onClick={() => setEditingOffer(null)}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        {/* Title IT & EN */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Titolo Prodotto (Italiano) *' : 'Product Title (Italian) *'}
                            </label>
                            <input
                              type="text"
                              value={editingOffer.title.it}
                              onChange={(e) =>
                                setEditingOffer({
                                  ...editingOffer,
                                  title: { ...editingOffer.title, it: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                              placeholder="es. SanDisk Extreme SSD 1TB NVMe"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Titolo Prodotto (Inglese)' : 'Product Title (English)'}
                            </label>
                            <input
                              type="text"
                              value={editingOffer.title.en}
                              onChange={(e) =>
                                setEditingOffer({
                                  ...editingOffer,
                                  title: { ...editingOffer.title, en: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                              placeholder="e.g. SanDisk Extreme 1TB NVMe SSD"
                            />
                          </div>
                        </div>

                        {/* Descriptions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Descrizione (Italiano) *' : 'Description (Italian) *'}
                            </label>
                            <textarea
                              rows={3}
                              value={editingOffer.description.it}
                              onChange={(e) =>
                                setEditingOffer({
                                  ...editingOffer,
                                  description: { ...editingOffer.description, it: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                              placeholder="Dettagli e specifiche principali del prodotto..."
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Descrizione (Inglese)' : 'Description (English)'}
                            </label>
                            <textarea
                              rows={3}
                              value={editingOffer.description.en}
                              onChange={(e) =>
                                setEditingOffer({
                                  ...editingOffer,
                                  description: { ...editingOffer.description, en: e.target.value },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-orange-500"
                              placeholder="Key specifications and highlights..."
                            />
                          </div>
                        </div>

                        {/* Prices & Discount calculation */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Prezzo Precedente (€)' : 'Previous Price (€)'}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingOffer.previousPrice ?? ''}
                              onChange={(e) => {
                                const val = e.target.value ? parseFloat(e.target.value) : null;
                                const discount = calculateDiscount(val, editingOffer.currentPrice);
                                setEditingOffer({
                                  ...editingOffer,
                                  previousPrice: val,
                                  discountPercent: discount,
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                              placeholder="es. 99.99"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Prezzo Attuale Offerta (€) *' : 'Current Deal Price (€) *'}
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={editingOffer.currentPrice || ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                const discount = calculateDiscount(editingOffer.previousPrice, val);
                                setEditingOffer({
                                  ...editingOffer,
                                  currentPrice: val,
                                  discountPercent: discount,
                                });
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                              placeholder="es. 69.99"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Sconto Calcolato' : 'Auto Discount'}
                            </label>
                            <div className="px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-black text-emerald-600 flex items-center justify-between">
                              <span>
                                {calculateDiscount(editingOffer.previousPrice, editingOffer.currentPrice)
                                  ? `-${calculateDiscount(editingOffer.previousPrice, editingOffer.currentPrice)}%`
                                  : isIt ? 'Nessuno sconto' : 'No discount'}
                              </span>
                              <span className="text-[10px] text-slate-400 font-normal">Formula automatica</span>
                            </div>
                          </div>
                        </div>

                        {/* Affiliate Link */}
                        <div>
                          <label className="text-xs font-bold text-slate-700 block mb-1">
                            {isIt ? 'Link Affiliato Amazon Specifico *' : 'Specific Amazon Affiliate Link *'}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="url"
                              value={editingOffer.affiliateLink}
                              onChange={(e) =>
                                setEditingOffer({ ...editingOffer, affiliateLink: e.target.value })
                              }
                              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs font-mono"
                              placeholder="https://www.amazon.it/dp/B08...?tag=tuotag-21"
                            />
                            <a
                              href={editingOffer.affiliateLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1"
                            >
                              <span>Test</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {isIt
                              ? 'Il pulsante "SCOPRI L\'OFFERTA SU AMAZON" utilizzerà ESATTAMENTE questo link con attributo rel="nofollow noopener sponsored".'
                              : 'The button will open EXACTLY this affiliate URL.'}
                          </p>
                        </div>

                        {/* Category & Status Toggles */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">
                              {isIt ? 'Categoria' : 'Category'}
                            </label>
                            <select
                              value={editingOffer.categoryId}
                              onChange={(e) =>
                                setEditingOffer({ ...editingOffer, categoryId: e.target.value })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                            >
                              {draftDb.categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.name.it}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="flex items-center gap-4 pt-4">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={editingOffer.isFlashDeal}
                                onChange={(e) =>
                                  setEditingOffer({ ...editingOffer, isFlashDeal: e.target.checked })
                                }
                                className="w-4 h-4 text-orange-600 rounded"
                              />
                              <span>⚡ {isIt ? 'Offerta Lampo' : 'Flash Deal'}</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={editingOffer.isFeatured}
                                onChange={(e) =>
                                  setEditingOffer({ ...editingOffer, isFeatured: e.target.checked })
                                }
                                className="w-4 h-4 text-orange-600 rounded"
                              />
                              <span>★ {isIt ? 'In Evidenza' : 'Featured'}</span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                              <input
                                type="checkbox"
                                checked={editingOffer.isPublished}
                                onChange={(e) =>
                                  setEditingOffer({ ...editingOffer, isPublished: e.target.checked })
                                }
                                className="w-4 h-4 text-orange-600 rounded"
                              />
                              <span>{isIt ? 'Pubblicata' : 'Published'}</span>
                            </label>
                          </div>
                        </div>

                        {/* Save Offer Buttons */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                          <button
                            type="button"
                            onClick={() => setEditingOffer(null)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                          >
                            {isIt ? 'Annulla' : 'Cancel'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (!editingOffer.title.it || editingOffer.currentPrice <= 0) {
                                alert(isIt ? 'Inserisci almeno il titolo e un prezzo attuale valido.' : 'Please enter title and valid price.');
                                return;
                              }
                              const existingIdx = draftDb.offers.findIndex((o) => o.id === editingOffer.id);
                              let updatedOffers = [...draftDb.offers];
                              if (existingIdx >= 0) {
                                updatedOffers[existingIdx] = editingOffer;
                              } else {
                                updatedOffers.unshift(editingOffer);
                              }
                              persistChanges({ ...draftDb, offers: updatedOffers });
                              setEditingOffer(null);
                            }}
                            className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider"
                          >
                            {isIt ? 'Salva Offerta' : 'Save Deal'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB: IDENTITY & BRAND */}
              {activeTab === 'identity' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading">
                      {isIt ? 'Identità Grafica & Personalizzazione White-Label' : 'Brand Identity & White-Label'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isIt ? 'Regola logo circolare, nome portale, payoff e colori' : 'Customize circular logo, portal name, payoff, and colors'}
                    </p>
                  </div>

                  {/* Circular Logo Upload & Preview */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative shrink-0">
                      <img
                        src={draftDb.config.logoUrl}
                        alt="Logo preview"
                        className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 shadow-xl ring-4 ring-orange-500/20"
                      />
                      <span className="absolute -bottom-1 -right-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-900 text-white">
                        {isIt ? 'CIRCOLARE' : 'CIRCULAR'}
                      </span>
                    </div>

                    <div className="space-y-2 flex-1">
                      <h5 className="text-sm font-bold text-slate-800">
                        {isIt ? 'Logo Circolare del Portale' : 'Circular Brand Logo'}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {isIt
                          ? 'Il logo viene sempre visualizzato e ritagliato in forma rigorosamente circolare. Carica un file immagine o incolla un URL.'
                          : 'Always rendered as a circular crop. Upload an image file or paste an image URL.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <label className="cursor-pointer px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isIt ? 'Carica Immagine Logo' : 'Upload Logo File'}</span>
                          <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Site Name and Payoff */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {isIt ? 'Nome del Sito / Brand *' : 'Site / Brand Name *'}
                      </label>
                      <input
                        type="text"
                        value={draftDb.config.siteName}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            config: { ...draftDb.config, siteName: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {isIt ? 'Colore Accento Primario' : 'Primary Accent Color'}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={draftDb.config.primaryAccentColor || '#f97316'}
                          onChange={(e) =>
                            setDraftDb({
                              ...draftDb,
                              config: { ...draftDb.config, primaryAccentColor: e.target.value },
                            })
                          }
                          className="w-10 h-10 rounded-xl border border-slate-300 cursor-pointer p-0.5"
                        />
                        <span className="text-xs font-mono font-bold text-slate-700">
                          {draftDb.config.primaryAccentColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {isIt ? 'Payoff (Italiano) *' : 'Payoff / Tagline (Italian) *'}
                      </label>
                      <textarea
                        rows={2}
                        value={draftDb.config.payoff.it}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            config: {
                              ...draftDb.config,
                              payoff: { ...draftDb.config.payoff, it: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {isIt ? 'Payoff (Inglese)' : 'Payoff / Tagline (English)'}
                      </label>
                      <textarea
                        rows={2}
                        value={draftDb.config.payoff.en}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            config: {
                              ...draftDb.config,
                              payoff: { ...draftDb.config.payoff, en: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-3">
                    <button
                      onClick={() => persistChanges(draftDb)}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isIt ? 'Salva Identità' : 'Save Identity'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: SOCIAL & WHATSAPP */}
              {activeTab === 'social' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading">
                      {isIt ? 'Collegamenti Social e WhatsApp' : 'Social & WhatsApp Links'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isIt
                        ? 'Tutti gli indirizzi e le etichette possono essere modificati qui.'
                        : 'Edit all social channels and WhatsApp numbers.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {draftDb.socialLinks.map((soc, idx) => (
                      <div key={soc.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: soc.color }} />
                            <span>{soc.name}</span>
                            {soc.isWhatsAppChannel && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                                Canale Ufficiale
                              </span>
                            )}
                          </span>
                          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={soc.isVisible}
                              onChange={(e) => {
                                const updated = [...draftDb.socialLinks];
                                updated[idx].isVisible = e.target.checked;
                                setDraftDb({ ...draftDb, socialLinks: updated });
                              }}
                              className="rounded text-orange-600"
                            />
                            <span>Visibile</span>
                          </label>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[11px] font-bold text-slate-500 block mb-1">
                              Etichetta Pulsante
                            </label>
                            <input
                              type="text"
                              value={soc.label.it}
                              onChange={(e) => {
                                const updated = [...draftDb.socialLinks];
                                updated[idx].label.it = e.target.value;
                                setDraftDb({ ...draftDb, socialLinks: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-500 block mb-1">
                              URL Destinazione
                            </label>
                            <input
                              type="url"
                              value={soc.url}
                              onChange={(e) => {
                                const updated = [...draftDb.socialLinks];
                                updated[idx].url = e.target.value;
                                setDraftDb({ ...draftDb, socialLinks: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Personal WhatsApp & Modal settings */}
                  <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200/80 space-y-3">
                    <h5 className="text-xs font-black uppercase tracking-wider text-amber-900">
                      {isIt ? 'Contatto WhatsApp Personale per "Vuoi un\'app così?"' : 'Personal WhatsApp Contact'}
                    </h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Numero WhatsApp (senza +)
                        </label>
                        <input
                          type="text"
                          value={draftDb.config.personalWhatsAppNumber}
                          onChange={(e) =>
                            setDraftDb({
                              ...draftDb,
                              config: { ...draftDb.config, personalWhatsAppNumber: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                          placeholder="393805872089"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">
                          Dicitura Contatto
                        </label>
                        <input
                          type="text"
                          value={draftDb.config.personalWhatsAppText.it}
                          onChange={(e) =>
                            setDraftDb({
                              ...draftDb,
                              config: {
                                ...draftDb.config,
                                personalWhatsAppText: { ...draftDb.config.personalWhatsAppText, it: e.target.value },
                              },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                          placeholder="Gian – WhatsApp: 380 587 2089"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => persistChanges(draftDb)}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isIt ? 'Salva Social & Contatti' : 'Save Socials'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: CATEGORIES */}
              {activeTab === 'categories' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-black text-slate-900 font-heading">
                        {isIt ? 'Gestione Categorie' : 'Manage Categories'}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {isIt ? 'Aggiungi, modifica o disattiva le categorie di offerte e risorse.' : 'Add, edit or disable categories.'}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        const newCat: Category = {
                          id: 'cat-' + Date.now(),
                          name: { it: isIt ? 'Nuova Categoria' : 'New Category', en: 'New Category' },
                          icon: 'Tag',
                          color: '#2563eb',
                          order: draftDb.categories.length + 1,
                          isVisible: true,
                        };
                        const updated = [...draftDb.categories, newCat];
                        persistChanges({ ...draftDb, categories: updated }, isIt ? 'Categoria creata' : 'Category added');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isIt ? 'Aggiungi Categoria' : 'Add Category'}</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {draftDb.categories.map((cat, idx) => (
                      <div key={cat.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="text"
                            value={cat.name.it}
                            onChange={(e) => {
                              const updated = [...draftDb.categories];
                              updated[idx].name.it = e.target.value;
                              setDraftDb({ ...draftDb, categories: updated });
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 flex-1 max-w-xs"
                          />
                          <input
                            type="text"
                            value={cat.name.en}
                            onChange={(e) => {
                              const updated = [...draftDb.categories];
                              updated[idx].name.en = e.target.value;
                              setDraftDb({ ...draftDb, categories: updated });
                            }}
                            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-600 flex-1 max-w-xs"
                            placeholder="EN translation"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-xs text-slate-600 font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={cat.isVisible !== false}
                              onChange={(e) => {
                                const updated = [...draftDb.categories];
                                updated[idx].isVisible = e.target.checked;
                                setDraftDb({ ...draftDb, categories: updated });
                              }}
                              className="rounded text-orange-600"
                            />
                            <span>{isIt ? 'Visibile' : 'Visible'}</span>
                          </label>

                          <button
                            onClick={() => {
                              if (confirm(isIt ? 'Vuoi eliminare questa categoria?' : 'Delete category?')) {
                                const updated = draftDb.categories.filter((c) => c.id !== cat.id);
                                persistChanges({ ...draftDb, categories: updated });
                              }
                            }}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => persistChanges(draftDb)}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isIt ? 'Salva Categorie' : 'Save Categories'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: AMAZON & SERVICES BUTTONS */}
              {activeTab === 'services' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading">
                      {isIt ? 'Amazon & Servizi (9 Pulsanti Rapidi)' : 'Amazon & Services (9 Quick Buttons)'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isIt
                        ? 'Pulsanti compatti senza ripetizione della parola "Servizio". Modifica link affiliati ed etichette.'
                        : 'Compact action buttons. Customize direct URLs and badges.'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {draftDb.services.map((srv, idx) => (
                      <div key={srv.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Etichetta IT</label>
                          <input
                            type="text"
                            value={srv.label.it}
                            onChange={(e) => {
                              const updated = [...draftDb.services];
                              updated[idx].label.it = e.target.value;
                              setDraftDb({ ...draftDb, services: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">Badge Promozionale</label>
                          <input
                            type="text"
                            value={srv.badge?.it || ''}
                            onChange={(e) => {
                              const updated = [...draftDb.services];
                              updated[idx].badge = { it: e.target.value, en: e.target.value };
                              setDraftDb({ ...draftDb, services: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
                            placeholder="es. 30 Giorni Gratis"
                          />
                        </div>

                        <div className="md:col-span-2 flex items-center gap-2">
                          <div className="flex-1">
                            <label className="text-[10px] font-bold text-slate-500 block mb-1">URL Affiliato Diretto</label>
                            <input
                              type="url"
                              value={srv.url}
                              onChange={(e) => {
                                const updated = [...draftDb.services];
                                updated[idx].url = e.target.value;
                                setDraftDb({ ...draftDb, services: updated });
                              }}
                              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-mono"
                            />
                          </div>

                          <label className="flex items-center gap-1 text-xs text-slate-600 font-semibold cursor-pointer shrink-0 pt-4">
                            <input
                              type="checkbox"
                              checked={srv.isVisible !== false}
                              onChange={(e) => {
                                const updated = [...draftDb.services];
                                updated[idx].isVisible = e.target.checked;
                                setDraftDb({ ...draftDb, services: updated });
                              }}
                              className="rounded text-orange-600"
                            />
                            <span>{isIt ? 'Attivo' : 'Active'}</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => persistChanges(draftDb)}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isIt ? 'Salva Servizi Amazon' : 'Save Services'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: BACKEND & GITHUB PAGES EXPORT */}
              {activeTab === 'backend-export' && (
                <div className="space-y-6">
                  {/* Download Box */}
                  <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-5">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/40">
                        <Download className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black font-heading text-white">
                          {isIt ? 'Consegna: Esporta Singolo File index.html' : 'Export Single index.html File'}
                        </h4>
                        <p className="text-xs text-slate-300">
                          {isIt
                            ? 'Genera e scarica il file completo index.html contenente HTML, CSS e JS integrati, pronto per GitHub Pages.'
                            : 'Generates a 100% self-contained index.html file with embedded database ready for GitHub Pages.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-2">
                      <p className="font-bold text-amber-400">
                        {isIt ? 'Come pubblicare su GitHub Pages in 3 passaggi:' : 'How to deploy to GitHub Pages in 3 steps:'}
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>{isIt ? 'Clicca sul pulsante sottostante "SCARICA index.html".' : 'Click "DOWNLOAD index.html" below.'}</li>
                        <li>{isIt ? 'Crea un repository su GitHub (es. nome-account.github.io oppure un repo pubblico) e carica direttamente il file index.html nella root.' : 'Create a GitHub repository and commit index.html to the root branch.'}</li>
                        <li>{isIt ? 'Vai su Settings > Pages del repository, imposta Source su "Deploy from a branch" (main/root) e salva. Il sito sarà online in meno di 60 secondi!' : 'Enable GitHub Pages in Settings > Pages. Your live portal is instantly online!'}</li>
                      </ol>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <button
                        onClick={handleDownloadStandaloneHtml}
                        className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-400 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 hover:scale-105 active:scale-95 transition"
                      >
                        <Download className="w-4 h-4" />
                        <span>{isIt ? 'SCARICA index.html ORA' : 'DOWNLOAD index.html NOW'}</span>
                      </button>

                      <button
                        onClick={handleExportJson}
                        className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition"
                      >
                        <Database className="w-4 h-4" />
                        <span>{isIt ? 'Backup Database (.json)' : 'Export Database (.json)'}</span>
                      </button>

                      <label className="cursor-pointer px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center gap-2 transition">
                        <Upload className="w-4 h-4" />
                        <span>{isIt ? 'Ripristina Backup' : 'Restore Backup'}</span>
                        <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Backend Configuration Guide */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
                    <h4 className="text-base font-black text-slate-900 font-heading flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-600" />
                      <span>{isIt ? 'Integrazione Backend Persistente (Firebase / Supabase)' : 'Persistent Cloud Backend'}</span>
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {isIt
                        ? 'L\'applicazione archivia permanentemente tutti i dati (offerte, logo, testi, contatti) nel LocalStorage del browser e li esporta all\'interno di index.html. Se desideri sincronizzare le offerte tra più dispositivi contemporaneamente, puoi collegare un progetto cloud gratuito Firebase o Supabase.'
                        : 'The app stores all data locally and bakes it into index.html. You can optionally connect a free cloud Firebase or Supabase project for real-time multi-device sync.'}
                    </p>

                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                      <div className="font-bold text-slate-800">
                        {isIt ? 'Istruzioni Backend Gratuito (Firebase Firestore):' : 'Firebase Instructions:'}
                      </div>
                      <ol className="list-decimal pl-5 space-y-1 text-slate-600">
                        <li>{isIt ? 'Crea un progetto gratuito sulla console Firebase (firebase.google.com).' : 'Create a free project at firebase.google.com.'}</li>
                        <li>{isIt ? 'Attiva Cloud Firestore in modalità test o con regole di lettura pubblica e scrittura protetta per la tua email.' : 'Enable Cloud Firestore.'}</li>
                        <li>{isIt ? 'Attiva Firebase Authentication (Email/Password).' : 'Enable Firebase Authentication.'}</li>
                        <li>{isIt ? 'Tutte le modifiche effettuate dal tuo pannello ADMIN rimarranno salvate per tutti i visitatori.' : 'All updates are synchronized for visitors.'}</li>
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: COMPLIANCE & LINGUE */}
              {activeTab === 'compliance' && (
                <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-6">
                  <div>
                    <h4 className="text-base font-black text-slate-900 font-heading">
                      {isIt ? 'Regole Affiliazione Amazon & Traduzioni' : 'Amazon Compliance & Translations'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isIt
                        ? 'Dichiarazione obbligatoria ai sensi dell\'Operating Agreement del Programma Affiliazione Amazon.'
                        : 'Mandatory disclaimer under the Amazon Associates Operating Agreement.'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Dichiarazione Affiliazione Obbligatoria (Italiano) *
                      </label>
                      <input
                        type="text"
                        value={draftDb.config.affiliateDisclaimer.it}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            config: {
                              ...draftDb.config,
                              affiliateDisclaimer: { ...draftDb.config.affiliateDisclaimer, it: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Dichiarazione Affiliazione Obbligatoria (Inglese) *
                      </label>
                      <input
                        type="text"
                        value={draftDb.config.affiliateDisclaimer.en}
                        onChange={(e) =>
                          setDraftDb({
                            ...draftDb,
                            config: {
                              ...draftDb.config,
                              affiliateDisclaimer: { ...draftDb.config.affiliateDisclaimer, en: e.target.value },
                            },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div className="p-3.5 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1">
                      <div className="font-bold">Informativa Importante Amazon Associates:</div>
                      <p className="text-[11px] leading-relaxed">
                        Non inventare sconti fittizi o prezzi non veritieri. Questa applicazione calcola lo sconto
                        esclusivamente quando il prezzo precedente e il prezzo attuale sono inseriti correttamente
                        secondo la formula approvata: ((Prezzo precedente - Prezzo attuale) / Prezzo precedente) × 100.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => persistChanges(draftDb)}
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isIt ? 'Salva Conformità' : 'Save Compliance'}</span>
                    </button>
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};
