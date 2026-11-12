export type Language = 'it' | 'en';

export type NavSection = 
  | 'home' 
  | 'offerte' 
  | 'offerte-lampo' 
  | 'categorie' 
  | 'app' 
  | 'idee' 
  | 'risorse' 
  | 'servizi' 
  | 'social' 
  | 'contatti';

export interface SiteConfig {
  siteName: string;
  payoff: {
    it: string;
    en: string;
  };
  logoUrl: string;
  primaryAccentColor: string; // e.g. #f97316 (orange)
  secondaryColor: string; // e.g. #2563eb (blue)
  personalWhatsAppNumber: string;
  personalWhatsAppText: {
    it: string;
    en: string;
  };
  affiliateDisclaimer: {
    it: string;
    en: string;
  };
  customAppModal: {
    title: { it: string; en: string };
    description: { it: string; en: string };
    contactLabel: { it: string; en: string };
    buttonText: { it: string; en: string };
    closeText: { it: string; en: string };
  };
  heroBanner: {
    title: { it: string; en: string };
    subtitle: { it: string; en: string };
    badge: { it: string; en: string };
    buttonText: { it: string; en: string };
    buttonLink: string;
    imageUrl: string;
    isVisible: boolean;
  };
  freeAppOfTheWeek: {
    title: { it: string; en: string };
    description: { it: string; en: string };
    badge: { it: string; en: string };
    buttonText: { it: string; en: string };
    linkUrl: string;
    imageUrl?: string;
    isVisible: boolean;
  };
  adminPassword: string; // stored salted/hashed or admin passcode
  backendConfig: {
    provider: 'local' | 'firebase' | 'supabase';
    firebaseConfig?: {
      apiKey: string;
      authDomain: string;
      projectId: string;
      storageBucket: string;
      appId: string;
    };
    supabaseConfig?: {
      url: string;
      anonKey: string;
    };
  };
}

export interface SocialLink {
  id: string;
  name: string;
  label: { it: string; en: string };
  url: string;
  iconName: 'facebook' | 'youtube' | 'whatsapp' | 'tiktok' | 'twitter' | 'instagram' | 'telegram' | 'link';
  color: string;
  isWhatsAppChannel?: boolean;
  isPersonalWhatsApp?: boolean;
  isVisible: boolean;
  order: number;
}

export interface Category {
  id: string;
  name: { it: string; en: string };
  icon: string;
  color: string;
  order: number;
  isVisible: boolean;
}

export interface AmazonOffer {
  id: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  previousPrice?: number | null; // Prezzo precedente (es. 99.99)
  currentPrice: number; // Prezzo attuale (es. 69.99)
  discountPercent?: number | null; // % calcolata automaticamente
  affiliateLink: string; // Link affiliato Amazon esatto
  categoryId: string;
  isFlashDeal: boolean;
  flashDealEndText?: { it: string; en: string };
  isFeatured: boolean;
  isPublished: boolean;
  createdAt: string;
}

export interface FreeApp {
  id: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  promoImageUrl?: string;
  destinationUrl: string;
  categoryId: string;
  badge?: { it: string; en: string };
  isPublished: boolean;
  createdAt: string;
}

export interface DigitalIdea {
  id: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  conceptTags: string[];
  destinationUrl?: string;
  categoryId: string;
  isPublished: boolean;
  createdAt: string;
}

export interface DigitalResource {
  id: string;
  title: { it: string; en: string };
  description: { it: string; en: string };
  resourceType: 'drive' | 'pdf' | 'template' | 'tool' | 'code' | 'zip';
  destinationUrl: string;
  categoryId: string;
  fileInfo?: string; // e.g. "Google Drive • PDF • 4.2 MB"
  isPublished: boolean;
  createdAt: string;
}

export interface AmazonService {
  id: string;
  label: { it: string; en: string };
  url: string;
  iconName: string;
  accentColor: string;
  badge?: { it: string; en: string };
  order: number;
  isVisible: boolean;
}

export interface AppDatabase {
  config: SiteConfig;
  socialLinks: SocialLink[];
  categories: Category[];
  offers: AmazonOffer[];
  apps: FreeApp[];
  ideas: DigitalIdea[];
  resources: DigitalResource[];
  services: AmazonService[];
}
