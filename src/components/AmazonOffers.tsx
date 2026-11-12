import React, { useState, useMemo } from 'react';
import {
  Tag,
  Zap,
  Search,
  Filter,
  ExternalLink,
  Percent,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';
import { AmazonOffer, Category, Language } from '../types';
import { calculateDiscount, formatCurrency } from '../storage';

interface AmazonOffersProps {
  offers: AmazonOffer[];
  categories: Category[];
  lang: Language;
  disclaimer: { it: string; en: string };
  initialFilter?: 'all' | 'flash' | 'featured';
}

export const AmazonOffers: React.FC<AmazonOffersProps> = ({
  offers,
  categories,
  lang,
  disclaimer,
  initialFilter = 'all',
}) => {
  const isIt = lang === 'it';
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [dealType, setDealType] = useState<'all' | 'flash' | 'featured'>(initialFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'discount' | 'priceAsc' | 'priceDesc' | 'newest'>('featured');

  // Filter visible & active offers
  const activeOffers = useMemo(() => {
    return offers.filter((o) => o.isPublished !== false);
  }, [offers]);

  // Applied filtering & sorting
  const filteredOffers = useMemo(() => {
    return activeOffers
      .filter((o) => {
        // Category filter
        if (selectedCategory !== 'all' && o.categoryId !== selectedCategory) {
          return false;
        }
        // Deal type filter
        if (dealType === 'flash' && !o.isFlashDeal) return false;
        if (dealType === 'featured' && !o.isFeatured) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const title = (o.title[lang] || o.title.it).toLowerCase();
          const desc = (o.description[lang] || o.description.it).toLowerCase();
          if (!title.includes(q) && !desc.includes(q)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'discount') {
          const discA = calculateDiscount(a.previousPrice, a.currentPrice) || a.discountPercent || 0;
          const discB = calculateDiscount(b.previousPrice, b.currentPrice) || b.discountPercent || 0;
          return discB - discA;
        }
        if (sortBy === 'priceAsc') {
          return a.currentPrice - b.currentPrice;
        }
        if (sortBy === 'priceDesc') {
          return b.currentPrice - a.currentPrice;
        }
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // default 'featured'
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return 0;
      });
  }, [activeOffers, selectedCategory, dealType, searchQuery, sortBy, lang]);

  const flashCount = activeOffers.filter((o) => o.isFlashDeal).length;
  const disclaimerText = disclaimer[lang] || disclaimer.it;

  return (
    <section id="offerte" className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/90 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
              <Tag className="w-5 h-5" />
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
              {isIt ? 'Offerte Amazon Selezionate' : 'Curated Amazon Deals'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            {isIt
              ? 'Offerte con prezzi verificate, sconti calcolati in tempo reale e link diretti con tag affiliato autorizzato.'
              : 'Verified pricing, real-time discount formula calculations and direct authorized affiliate links.'}
          </p>
        </div>

        {/* Quick Deal Type Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl self-start md:self-auto border border-transparent dark:border-slate-700/60">
          <button
            onClick={() => setDealType('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              dealType === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isIt ? 'Tutte' : 'All'} ({activeOffers.length})
          </button>
          <button
            onClick={() => setDealType('flash')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              dealType === 'flash'
                ? 'bg-red-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{isIt ? 'Offerte Lampo' : 'Flash Deals'}</span>
            {flashCount > 0 && (
              <span className="text-[10px] px-1.5 rounded-full bg-white/20 font-black">
                {flashCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setDealType('featured')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
              dealType === 'featured'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Top</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={isIt ? 'Cerca tra le offerte (es. SSD, cuffie, Alexa)...' : 'Search deals (e.g. SSD, headphones)...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:bg-white dark:focus:bg-slate-800 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>
          )}
        </div>

          {/* Category selector */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="all">{isIt ? 'Tutte le Categorie' : 'All Categories'}</option>
              {categories
                .filter((c) => c.isVisible !== false)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name[lang] || c.name.it}
                  </option>
                ))}
            </select>

            {/* Sort By */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 dark:border-slate-800">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              >
                <option value="featured">{isIt ? 'In Evidenza' : 'Featured'}</option>
                <option value="discount">{isIt ? 'Sconto Maggiore' : 'Highest Discount'}</option>
                <option value="priceAsc">{isIt ? 'Prezzo più basso' : 'Price: Low to High'}</option>
                <option value="priceDesc">{isIt ? 'Prezzo più alto' : 'Price: High to Low'}</option>
                <option value="newest">{isIt ? 'Più Recenti' : 'Newest'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offers Product Cards Grid (STRICT COMPLIANCE: NO PRODUCT PHOTOS!) */}
        {filteredOffers.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
            <Tag className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">
              {isIt ? 'Nessuna offerta trovata' : 'No offers found'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              {isIt
                ? 'Prova a modificare la ricerca o il filtro di categoria.'
                : 'Try adjusting your search query or category filter.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setDealType('all');
              }}
              className="px-4 py-2 rounded-xl bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 font-bold text-xs hover:bg-orange-200 transition"
            >
              {isIt ? 'Ripristina tutti i filtri' : 'Reset all filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => {
              const title = offer.title[lang] || offer.title.it;
              const description = offer.description[lang] || offer.description.it;
              const category = categories.find((c) => c.id === offer.categoryId);
              const categoryName = category ? category.name[lang] || category.name.it : null;

              // Calculated discount %
              const calculatedDisc = calculateDiscount(offer.previousPrice, offer.currentPrice);
              const displayDiscount = calculatedDisc ?? offer.discountPercent;

              return (
                <div
                  key={offer.id}
                  className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 space-y-5"
                >
                  {/* Top Badge Row */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      {categoryName ? (
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition">
                          {categoryName}
                        </span>
                      ) : (
                        <span />
                      )}

                      <div className="flex items-center gap-1.5">
                        {offer.isFlashDeal && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 animate-pulse">
                            <Zap className="w-3 h-3 fill-current" />
                            <span>{isIt ? 'LAMPO' : 'FLASH'}</span>
                          </span>
                        )}

                        {offer.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>TOP</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Flash deal time banner if applicable */}
                    {offer.isFlashDeal && offer.flashDealEndText && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-50/80 dark:bg-red-950/40 px-3 py-1 rounded-xl border border-red-200/60 dark:border-red-900/60">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{offer.flashDealEndText[lang] || offer.flashDealEndText.it}</span>
                      </div>
                    )}

                    {/* Product Title - Clean, bold typography */}
                    <h4 className="text-lg font-black text-slate-900 dark:text-white font-heading leading-snug group-hover:text-orange-600 dark:group-hover:text-orange-400 transition">
                      {title}
                    </h4>

                    {/* Product Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {description}
                    </p>
                  </div>

                  {/* Price Box & CTA Button */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                    {/* Prices & Discount calculation */}
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          {isIt ? 'Prezzo Offerta' : 'Deal Price'}
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading tracking-tight">
                          {formatCurrency(offer.currentPrice)}
                        </div>
                        {offer.previousPrice && offer.previousPrice > 0 && (
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{isIt ? 'Invece di' : 'Was'}:</span>
                            <span className="line-through font-semibold">
                              {formatCurrency(offer.previousPrice)}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Discount badge */}
                      {displayDiscount && displayDiscount > 0 ? (
                        <div className="text-right">
                          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-500 text-white font-black text-sm shadow-sm">
                            <Percent className="w-3.5 h-3.5" />
                            <span>-{displayDiscount}%</span>
                          </span>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                            {isIt ? 'Risparmio reale' : 'True savings'}
                          </div>
                        </div>
                      ) : null}
                    </div>

                    {/* Prominent Button: SCOPRI L'OFFERTA SU AMAZON */}
                    <a
                      href={offer.affiliateLink}
                      target="_blank"
                      rel="nofollow noopener sponsored"
                      className="w-full py-3.5 px-4 rounded-2xl bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-black text-xs uppercase tracking-wider shadow-md hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 group/btn"
                    >
                      <span>{isIt ? "SCOPRI L'OFFERTA SU AMAZON" : 'VIEW DEAL ON AMAZON'}</span>
                      <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mandatory Amazon Affiliate Disclaimer Box */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-100/90 dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-center">
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            ⚖️ <span className="font-semibold text-slate-800 dark:text-slate-200">{isIt ? 'Trasparenza Affiliazione' : 'Affiliate Disclosure'}:</span>{' '}
            "{disclaimerText}"
          </p>
        </div>
    </section>
  );
};
