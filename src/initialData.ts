import { AppDatabase } from './types';

// Default circular SVG avatar with high-end tech gradient for Digital Creator Lab
export const DEFAULT_LOGO_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200"><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ea580c"/><stop offset="50%" stop-color="%23f97316"/><stop offset="100%" stop-color="%232563eb"/></linearGradient><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.25"/><stop offset="100%" stop-color="%23000000" stop-opacity="0.4"/></radialGradient></defs><circle cx="100" cy="100" r="96" fill="%230b1329" stroke="url(%23grad)" stroke-width="6"/><circle cx="100" cy="100" r="88" fill="url(%23glow)"/><path d="M65 60 L105 60 C128 60 142 75 142 100 C142 125 128 140 105 140 L65 140 Z" fill="none" stroke="url(%23grad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><polygon points="88,82 124,100 88,118" fill="%23f97316"/><circle cx="148" cy="62" r="10" fill="%232563eb"/></svg>`;

export const initialDatabase: AppDatabase = {
  config: {
    siteName: 'DIGITAL CREATOR LAB',
    payoff: {
      it: 'Vetrina digitale di offerte selezionate, app gratuite e risorse per creator',
      en: 'Digital showcase of curated offers, free apps, and creator resources',
    },
    logoUrl: DEFAULT_LOGO_SVG,
    primaryAccentColor: '#f97316', // Vibrant orange
    secondaryColor: '#2563eb', // Tech blue
    personalWhatsAppNumber: '393805872089',
    personalWhatsAppText: {
      it: 'Gian – WhatsApp: 380 587 2089',
      en: 'Gian – WhatsApp: +39 380 587 2089',
    },
    affiliateDisclaimer: {
      it: 'In qualità di Affiliato Amazon io ricevo un guadagno dagli acquisti idonei.',
      en: 'As an Amazon Associate I earn from qualifying purchases.',
    },
    customAppModal: {
      title: {
        it: 'Ti è piaciuta quest\'app?',
        en: 'Did you like this app?',
      },
      description: {
        it: 'Posso crearne una personalizzata per te, con il tuo nome, il tuo logo, il tuo link e le tue offerte. Scrivimi in privato su WhatsApp e ti spiego tutto, senza impegno.',
        en: 'I can create a custom version for you, with your name, logo, links, and offers. Message me directly on WhatsApp and I\'ll explain everything, no obligation.',
      },
      contactLabel: {
        it: 'Gian – WhatsApp: 380 587 2089',
        en: 'Gian – WhatsApp: +39 380 587 2089',
      },
      buttonText: {
        it: 'SCRIVIMI SU WHATSAPP',
        en: 'MESSAGE ME ON WHATSAPP',
      },
      closeText: {
        it: 'CHIUDI',
        en: 'CLOSE',
      },
    },
    heroBanner: {
      title: {
        it: 'Il Tuo Hub Digitale: Offerte Top, Idee e App Gratuite',
        en: 'Your Digital Hub: Top Offers, Ideas & Free Apps',
      },
      subtitle: {
        it: 'Scopri ogni giorno le migliori offerte verificate Amazon senza distrazioni, le app esclusive del Lab e risorse scaricabili per progetti digitali.',
        en: 'Discover daily verified Amazon deals without clutter, exclusive Lab free tools, and downloadable creator assets.',
      },
      badge: {
        it: 'LABORATORIO DIGITALE 2026',
        en: 'DIGITAL LAB 2026',
      },
      buttonText: {
        it: 'ESPLORA TUTTE LE OFFERTE',
        en: 'EXPLORE ALL OFFERS',
      },
      buttonLink: '#offerte',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
      isVisible: true,
    },
    freeAppOfTheWeek: {
      title: {
        it: 'Link & Promo Builder WebApp',
        en: 'Link & Promo Builder WebApp',
      },
      description: {
        it: 'Generatore rapido di landing page per creator e affiliati. Leggero, veloce e ottimizzato per mobile con pulsanti social dinamici.',
        en: 'Fast landing page generator for creators and affiliates. Lightweight, lightning fast and mobile optimized with dynamic social links.',
      },
      badge: {
        it: 'APP GRATIS DELLA SETTIMANA',
        en: 'FREE APP OF THE WEEK',
      },
      buttonText: {
        it: 'PROVA L\'APP GRATUITA',
        en: 'TRY FREE APP',
      },
      linkUrl: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      isVisible: true,
    },
    adminPassword: '8873', // Passcode riservato amministratore (codice 8873)
    backendConfig: {
      provider: 'local',
      firebaseConfig: undefined,
      supabaseConfig: undefined,
    },
  },
  socialLinks: [
    {
      id: 'soc-whatsapp-channel',
      name: 'WhatsApp Channel',
      label: {
        it: 'APPLICAZIONI GRATUITE',
        en: 'FREE APPLICATIONS',
      },
      url: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      iconName: 'whatsapp',
      color: '#25D366',
      isWhatsAppChannel: true,
      isVisible: true,
      order: 1,
    },
    {
      id: 'soc-facebook',
      name: 'Facebook',
      label: {
        it: 'Facebook',
        en: 'Facebook',
      },
      url: 'https://www.facebook.com/DigitalCreatorLabIT/',
      iconName: 'facebook',
      color: '#1877F2',
      isVisible: true,
      order: 2,
    },
    {
      id: 'soc-youtube',
      name: 'YouTube',
      label: {
        it: 'YouTube',
        en: 'YouTube',
      },
      url: 'https://www.youtube.com/@digitalcreatorlabIT',
      iconName: 'youtube',
      color: '#FF0000',
      isVisible: true,
      order: 3,
    },
    {
      id: 'soc-tiktok',
      name: 'TikTok',
      label: {
        it: 'TikTok',
        en: 'TikTok',
      },
      url: 'https://www.tiktok.com/@digital_creatorlab',
      iconName: 'tiktok',
      color: '#000000',
      isVisible: true,
      order: 4,
    },
    {
      id: 'soc-x',
      name: 'X (Twitter)',
      label: {
        it: 'X',
        en: 'X',
      },
      url: 'https://x.com/v81978',
      iconName: 'twitter',
      color: '#0f172a',
      isVisible: true,
      order: 5,
    },
    {
      id: 'soc-wa-personal',
      name: 'WhatsApp Personale',
      label: {
        it: 'WhatsApp Gian',
        en: 'WhatsApp Gian',
      },
      url: 'https://wa.me/393805872089',
      iconName: 'whatsapp',
      color: '#128C7E',
      isPersonalWhatsApp: true,
      isVisible: true,
      order: 6,
    },
  ],
  categories: [
    {
      id: 'cat-tech',
      name: {
        it: 'Tech & Gadget',
        en: 'Tech & Gadgets',
      },
      icon: 'Cpu',
      color: '#2563eb',
      order: 1,
      isVisible: true,
    },
    {
      id: 'cat-audio',
      name: {
        it: 'Audio & Musica',
        en: 'Audio & Music',
      },
      icon: 'Headphones',
      color: '#8b5cf6',
      order: 2,
      isVisible: true,
    },
    {
      id: 'cat-smart-home',
      name: {
        it: 'Smart Home & Ufficio',
        en: 'Smart Home & Office',
      },
      icon: 'Home',
      color: '#059669',
      order: 3,
      isVisible: true,
    },
    {
      id: 'cat-storage',
      name: {
        it: 'Storage & Accessori PC',
        en: 'Storage & PC Accessories',
      },
      icon: 'HardDrive',
      color: '#ea580c',
      order: 4,
      isVisible: true,
    },
    {
      id: 'cat-creator-tools',
      name: {
        it: 'Risorse Creator',
        en: 'Creator Resources',
      },
      icon: 'Sparkles',
      color: '#d97706',
      order: 5,
      isVisible: true,
    },
  ],
  offers: [
    {
      id: 'off-1',
      title: {
        it: 'Echo Dot (5ª generazione) Altoparlante Intelligente con Alexa',
        en: 'Echo Dot (5th Gen) Smart Speaker with Alexa',
      },
      description: {
        it: 'Audio potente con voci più nitide e bassi profondi in qualsiasi stanza. Controlla musica, timer e dispositivi per la casa intelligente compatibili con la voce.',
        en: 'Vibrant sound with clearer vocals and deeper bass. Control music, timers, and compatible smart home devices with voice commands.',
      },
      previousPrice: 64.99,
      currentPrice: 39.99,
      discountPercent: 38,
      affiliateLink: 'https://www.amazon.it/dp/B09B8W5FW7?tag=digitalcreatorlab-21',
      categoryId: 'cat-smart-home',
      isFlashDeal: true,
      flashDealEndText: {
        it: 'Offerta a tempo limitato',
        en: 'Limited time deal',
      },
      isFeatured: true,
      isPublished: true,
      createdAt: '2026-11-10T10:00:00Z',
    },
    {
      id: 'off-2',
      title: {
        it: 'SanDisk Extreme SSD Portatile 1TB NVMe USB 3.2 Gen 2',
        en: 'SanDisk Extreme 1TB Portable NVMe SSD USB 3.2 Gen 2',
      },
      description: {
        it: 'Prestazioni a stato solido NVMe veloci fino a 1050 MB/s in lettura e 1000 MB/s in scrittura. Resistente a cadute fino a 2 metri e protezione IP65 contro acqua e polvere.',
        en: 'Fast NVMe solid-state performance with up to 1050 MB/s read and 1000 MB/s write speeds. Drop protection up to 2 meters and IP65 dust and water resistance.',
      },
      previousPrice: 149.99,
      currentPrice: 99.90,
      discountPercent: 33,
      affiliateLink: 'https://www.amazon.it/dp/B08GTYFC37?tag=digitalcreatorlab-21',
      categoryId: 'cat-storage',
      isFlashDeal: true,
      flashDealEndText: {
        it: 'Scorte limitate',
        en: 'Limited stock',
      },
      isFeatured: true,
      isPublished: true,
      createdAt: '2026-11-10T11:00:00Z',
    },
    {
      id: 'off-3',
      title: {
        it: 'Logitech MX Master 3S Mouse Wireless ad Alte Prestazioni',
        en: 'Logitech MX Master 3S Wireless Performance Mouse',
      },
      description: {
        it: 'Sensore Darkfield 8K DPI per tracciamento su qualunque superficie, inclusi vetri. Clic silenziosi e scorrimento elettromagnetico MagSpeed ultra-preciso.',
        en: 'Darkfield 8K DPI sensor tracks on any surface, even glass. Quiet Clicks and ultra-fast MagSpeed electromagnetic scrolling.',
      },
      previousPrice: 129.00,
      currentPrice: 89.99,
      discountPercent: 30,
      affiliateLink: 'https://www.amazon.it/dp/B07W4DGY38?tag=digitalcreatorlab-21',
      categoryId: 'cat-tech',
      isFlashDeal: false,
      isFeatured: true,
      isPublished: true,
      createdAt: '2026-11-09T14:00:00Z',
    },
    {
      id: 'off-4',
      title: {
        it: 'Anker Caricatore USB-C 65W GaN II con 3 Porte (2x USB-C + USB-A)',
        en: 'Anker 65W GaN II Fast Charger 3 Ports (2x USB-C + USB-A)',
      },
      description: {
        it: 'Carica ad alta velocità per notebook, MacBook, iPhone, tablet e smartphone contemporaneamente con tecnologia GaN II ultra-compatta e sicura.',
        en: 'High-speed charging for laptops, tablets, and phones simultaneously in an ultra-compact GaN II design.',
      },
      previousPrice: 49.99,
      currentPrice: 34.99,
      discountPercent: 30,
      affiliateLink: 'https://www.amazon.it/dp/B091K41RN7?tag=digitalcreatorlab-21',
      categoryId: 'cat-tech',
      isFlashDeal: true,
      flashDealEndText: {
        it: 'Offerta lampo del giorno',
        en: 'Lightning deal today',
      },
      isFeatured: false,
      isPublished: true,
      createdAt: '2026-11-08T09:30:00Z',
    },
    {
      id: 'off-5',
      title: {
        it: 'Sony WH-1000XM5 Cuffie Wireless con Cancellazione Attiva del Rumore',
        en: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
      },
      description: {
        it: 'Due processori e 8 microfoni per una cancellazione del rumore ai vertici della categoria. Fino a 30 ore di autonomia con ricarica ultra-rapida.',
        en: 'Industry-leading noise cancellation powered by two processors and 8 microphones. Up to 30-hour battery life with quick charging.',
      },
      previousPrice: 420.00,
      currentPrice: 299.00,
      discountPercent: 29,
      affiliateLink: 'https://www.amazon.it/dp/B09Y2MYL5C?tag=digitalcreatorlab-21',
      categoryId: 'cat-audio',
      isFlashDeal: false,
      isFeatured: true,
      isPublished: true,
      createdAt: '2026-11-07T16:15:00Z',
    },
    {
      id: 'off-6',
      title: {
        it: 'Kindle Paperwhite (16 GB) Schermo antiriflesso 6,8" con luce regolabile',
        en: 'Kindle Paperwhite (16 GB) 6.8" Glare-Free Display with Warm Light',
      },
      description: {
        it: 'Schermo da 300 ppi senza riflessi anche alla luce diretta del sole. Tonalità della luce regolabile da bianco ad ambra e batteria che dura fino a 10 settimane.',
        en: '300 ppi glare-free display that reads like real paper even in bright sunlight. Adjustable warm light and battery lasting up to 10 weeks.',
      },
      previousPrice: 169.99,
      currentPrice: 139.99,
      discountPercent: 18,
      affiliateLink: 'https://www.amazon.it/dp/B08N41Y4Q2?tag=digitalcreatorlab-21',
      categoryId: 'cat-tech',
      isFlashDeal: false,
      isFeatured: false,
      isPublished: true,
      createdAt: '2026-11-06T12:00:00Z',
    },
  ],
  apps: [
    {
      id: 'app-1',
      title: {
        it: 'QR Code Styler & Generator HD',
        en: 'HD QR Code Styler & Generator',
      },
      description: {
        it: 'Crea codici QR personalizzati con logo circolare incorporato, colori gradiente e download in alta risoluzione PNG e SVG.',
        en: 'Generate customized QR codes with embedded circular logo, gradient colors, and high-res PNG/SVG downloads.',
      },
      destinationUrl: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      categoryId: 'cat-creator-tools',
      badge: {
        it: 'GRATIS AL 100%',
        en: '100% FREE',
      },
      isPublished: true,
      createdAt: '2026-11-10T09:00:00Z',
    },
    {
      id: 'app-2',
      title: {
        it: 'Calcolatore Sconto & Margini Affiliazione',
        en: 'Discount & Affiliate Margin Calculator',
      },
      description: {
        it: 'Webapp rapida per verificare formule di sconto reale, calcolare commissioni nette e generare snippet di testo per post social.',
        en: 'Quick web tool to calculate true discounts, net affiliate commissions, and generate formatted social copy.',
      },
      destinationUrl: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      categoryId: 'cat-creator-tools',
      badge: {
        it: 'WEB APP',
        en: 'WEB APP',
      },
      isPublished: true,
      createdAt: '2026-11-08T15:00:00Z',
    },
    {
      id: 'app-3',
      title: {
        it: 'Smart Link in Bio Creator',
        en: 'Smart Link in Bio Creator',
      },
      description: {
        it: 'Costruisci la tua micro-landing page multi-link per Instagram, TikTok e WhatsApp in meno di 2 minuti.',
        en: 'Build your multi-link bio landing page for Instagram, TikTok and WhatsApp in under 2 minutes.',
      },
      destinationUrl: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      categoryId: 'cat-creator-tools',
      badge: {
        it: 'NUOVA',
        en: 'NEW',
      },
      isPublished: true,
      createdAt: '2026-11-05T18:00:00Z',
    },
  ],
  ideas: [
    {
      id: 'idea-1',
      title: {
        it: 'Strategia Telegram + WhatsApp per Offerte di Valore',
        en: 'Telegram + WhatsApp Strategy for Value Deals',
      },
      description: {
        it: 'Come strutturare canali tematici senza fare spam, pubblicando esclusivamente prodotti con reale minimo storico e recensioni verificate a 4+ stelle.',
        en: 'How to build themed deal channels without spam, sharing exclusively genuine all-time low prices and 4+ star verified reviews.',
      },
      conceptTags: ['Affiliazione', 'Community', 'Growth'],
      destinationUrl: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      categoryId: 'cat-creator-tools',
      isPublished: true,
      createdAt: '2026-11-04T10:00:00Z',
    },
    {
      id: 'idea-2',
      title: {
        it: 'Setup Produttività Minimal per Creator Nomadi',
        en: 'Minimalist Productivity Setup for Mobile Creators',
      },
      description: {
        it: 'Guida all\'ecosistema hardware e software ultraleggero: un solo caricatore GaN, hub multifunzione e workflow per lavorare ovunque in mobilità.',
        en: 'Guide to an ultra-lightweight hardware and software ecosystem: single GaN charger, multi-hub, and mobile creator workflows.',
      },
      conceptTags: ['Hardware', 'Setup', 'Mobile'],
      destinationUrl: 'https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C',
      categoryId: 'cat-tech',
      isPublished: true,
      createdAt: '2026-11-02T14:00:00Z',
    },
  ],
  resources: [
    {
      id: 'res-1',
      title: {
        it: 'Checklist Conformità Affiliazione Amazon Italia 2026',
        en: '2026 Amazon Associates Italy Compliance Checklist',
      },
      description: {
        it: 'Documento PDF con tutte le clausole aggiornate: divieto di scraping foto, corretta dichiarazione di guadagno, regole sui prezzi e link consentiti.',
        en: 'PDF guide covering all updated rules: product photo policies, mandatory disclaimer text, price display guidelines and authorized tags.',
      },
      resourceType: 'pdf',
      destinationUrl: 'https://drive.google.com/',
      categoryId: 'cat-creator-tools',
      fileInfo: 'Google Drive • Documento PDF',
      isPublished: true,
      createdAt: '2026-11-03T08:00:00Z',
    },
    {
      id: 'res-2',
      title: {
        it: 'Template Fogli Google per Tracciamento Offerte e Performance',
        en: 'Google Sheets Template for Deal & Click Tracking',
      },
      description: {
        it: 'Foglio di calcolo pronto all\'uso per categorizzare le promozioni, calcolare gli sconti percentuali e monitorare i link con tag affiliato.',
        en: 'Ready-to-use spreadsheet to categorize promotions, calculate percentage discounts, and organize affiliate tagged links.',
      },
      resourceType: 'template',
      destinationUrl: 'https://drive.google.com/',
      categoryId: 'cat-creator-tools',
      fileInfo: 'Google Sheets • Modello Condiviso',
      isPublished: true,
      createdAt: '2026-11-01T11:00:00Z',
    },
  ],
  services: [
    {
      id: 'srv-prime',
      label: {
        it: 'Iscriviti a Prime',
        en: 'Join Prime',
      },
      url: 'https://www.amazon.it/amazonprime?tag=digitalcreatorlab-21',
      iconName: 'Zap',
      accentColor: '#00A8E1',
      badge: {
        it: '30 Giorni Gratis',
        en: '30 Days Free',
      },
      order: 1,
      isVisible: true,
    },
    {
      id: 'srv-music',
      label: {
        it: 'Scopri Amazon Music',
        en: 'Discover Amazon Music',
      },
      url: 'https://www.amazon.it/music/unlimited?tag=digitalcreatorlab-21',
      iconName: 'Music',
      accentColor: '#25d366',
      badge: {
        it: 'HD Senza Limiti',
        en: 'Unlimited HD',
      },
      order: 2,
      isVisible: true,
    },
    {
      id: 'srv-audible',
      label: {
        it: 'Prova Audible',
        en: 'Try Audible',
      },
      url: 'https://www.amazon.it/hz/audible/mlp?tag=digitalcreatorlab-21',
      iconName: 'Headphones',
      accentColor: '#f59e0b',
      badge: {
        it: 'Audiolibri Top',
        en: 'Top Audiobooks',
      },
      order: 3,
      isVisible: true,
    },
    {
      id: 'srv-kindle',
      label: {
        it: 'Scopri Kindle',
        en: 'Discover Kindle',
      },
      url: 'https://www.amazon.it/kindle-dbs/hz/signup?tag=digitalcreatorlab-21',
      iconName: 'BookOpen',
      accentColor: '#6366f1',
      order: 4,
      isVisible: true,
    },
    {
      id: 'srv-photos',
      label: {
        it: 'Scopri Amazon Photos',
        en: 'Discover Amazon Photos',
      },
      url: 'https://www.amazon.it/photos?tag=digitalcreatorlab-21',
      iconName: 'Camera',
      accentColor: '#ec4899',
      badge: {
        it: 'Spazio Illimitato',
        en: 'Unlimited Storage',
      },
      order: 5,
      isVisible: true,
    },
    {
      id: 'srv-prime-video',
      label: {
        it: 'Scopri Prime Video',
        en: 'Discover Prime Video',
      },
      url: 'https://www.primevideo.com/?tag=digitalcreatorlab-21',
      iconName: 'Film',
      accentColor: '#00A8E1',
      order: 6,
      isVisible: true,
    },
    {
      id: 'srv-kids',
      label: {
        it: 'Scopri Amazon Kids+',
        en: 'Discover Amazon Kids+',
      },
      url: 'https://www.amazon.it/kids?tag=digitalcreatorlab-21',
      iconName: 'Smile',
      accentColor: '#10b981',
      order: 7,
      isVisible: true,
    },
    {
      id: 'srv-business',
      label: {
        it: 'Scopri Amazon Business',
        en: 'Discover Amazon Business',
      },
      url: 'https://www.amazon.it/business?tag=digitalcreatorlab-21',
      iconName: 'Briefcase',
      accentColor: '#3b82f6',
      badge: {
        it: 'IVA Scorporata',
        en: 'Tax Invoices',
      },
      order: 8,
      isVisible: true,
    },
    {
      id: 'srv-fresh',
      label: {
        it: 'Scopri Amazon Fresh',
        en: 'Discover Amazon Fresh',
      },
      url: 'https://www.amazon.it/fresh?tag=digitalcreatorlab-21',
      iconName: 'ShoppingBag',
      accentColor: '#16a34a',
      order: 9,
      isVisible: true,
    },
  ],
};
