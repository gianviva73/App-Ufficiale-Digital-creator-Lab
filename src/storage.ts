import { AppDatabase } from './types';
import { initialDatabase } from './initialData';

const STORAGE_KEY = 'digital_creator_lab_db_v1';
const LANG_STORAGE_KEY = 'digital_creator_lab_lang_v1';

export function loadDatabase(): AppDatabase {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveDatabase(initialDatabase);
      return initialDatabase;
    }
    const parsed = JSON.parse(raw);
    let socialLinks = Array.isArray(parsed.socialLinks) ? parsed.socialLinks : initialDatabase.socialLinks;
    // Check if social links have the old verbose labels or outdated ordering
    const fb = socialLinks.find((s: any) => s.id === 'soc-facebook');
    if (!fb || fb.label?.it === 'Facebook Digital Creator Lab' || fb.order > 2) {
      socialLinks = initialDatabase.socialLinks;
    }

    let config = {
      ...initialDatabase.config,
      ...(parsed.config || {}),
      payoff: { ...initialDatabase.config.payoff, ...(parsed.config?.payoff || {}) },
      affiliateDisclaimer: { ...initialDatabase.config.affiliateDisclaimer, ...(parsed.config?.affiliateDisclaimer || {}) },
      customAppModal: { ...initialDatabase.config.customAppModal, ...(parsed.config?.customAppModal || {}) },
      heroBanner: { ...initialDatabase.config.heroBanner, ...(parsed.config?.heroBanner || {}) },
      freeAppOfTheWeek: { ...initialDatabase.config.freeAppOfTheWeek, ...(parsed.config?.freeAppOfTheWeek || {}) },
      backendConfig: { ...initialDatabase.config.backendConfig, ...(parsed.config?.backendConfig || {}) },
    };

    // If password was default 'admin' or empty, migrate to requested code '8873'
    if (!config.adminPassword || config.adminPassword === 'admin') {
      config.adminPassword = '8873';
    }

    return {
      config,
      socialLinks,
      categories: Array.isArray(parsed.categories) ? parsed.categories : initialDatabase.categories,
      offers: Array.isArray(parsed.offers) ? parsed.offers : initialDatabase.offers,
      apps: Array.isArray(parsed.apps) ? parsed.apps : initialDatabase.apps,
      ideas: Array.isArray(parsed.ideas) ? parsed.ideas : initialDatabase.ideas,
      resources: Array.isArray(parsed.resources) ? parsed.resources : initialDatabase.resources,
      services: Array.isArray(parsed.services) ? parsed.services : initialDatabase.services,
    };
  } catch (err) {
    console.error('Failed to load database from localStorage, falling back to initial data', err);
    return initialDatabase;
  }
}

export function saveDatabase(data: AppDatabase): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save database to localStorage', err);
  }
}

const THEME_STORAGE_KEY = 'digital_creator_lab_theme_v1';

export function loadStoredTheme(): 'light' | 'dark' {
  try {
    const theme = localStorage.getItem(THEME_STORAGE_KEY);
    if (theme === 'dark' || theme === 'light') return theme;
  } catch {}
  return 'light';
}

export function saveStoredTheme(theme: 'light' | 'dark'): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
}

export function loadStoredLanguage(): 'it' | 'en' {
  try {
    const lang = localStorage.getItem(LANG_STORAGE_KEY);
    if (lang === 'en' || lang === 'it') return lang;
  } catch {
    // Ignore error
  }
  return 'it';
}

export function saveStoredLanguage(lang: 'it' | 'en'): void {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // Ignore error
  }
}

/**
 * Calculates Amazon discount percentage strictly following the formula:
 * ((Prezzo precedente - Prezzo attuale) / Prezzo precedente) * 100
 */
export function calculateDiscount(previousPrice?: number | null, currentPrice?: number | null): number | null {
  if (previousPrice == null || currentPrice == null) return null;
  const prev = Number(previousPrice);
  const curr = Number(currentPrice);
  if (isNaN(prev) || isNaN(curr) || prev <= 0 || curr <= 0) return null;
  if (prev <= curr) return null; // No positive discount
  const discount = Math.round(((prev - curr) / prev) * 100);
  return discount > 0 ? discount : null;
}

/**
 * Formats EUR currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
