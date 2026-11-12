import { AppDatabase } from '../types';

/**
 * Generates a 100% self-contained, standalone index.html file containing HTML, CSS and JS
 * ready to be opened directly in Google Chrome or uploaded to GitHub Pages.
 * It embeds:
 * - Full responsive layout with collapsible dark sidebar
 * - Light / Dark mode toggle (☀️ / 🌙)
 * - Bilingual support (IT 🇮🇹 / EN 🇬🇧)
 * - Strict Amazon affiliate compliance (NO product images, math discounts, rel="nofollow noopener sponsored", disclaimer)
 * - Compact social bar with Facebook in 2nd position
 * - "VUOI UN'APP COSÌ?" WhatsApp contact modal (Gian: 380 587 2089)
 * - In-page Admin Panel protected by PIN 8873 with deal management, site branding & export
 */
export function generateStandaloneHtml(db: AppDatabase): string {
  const dbJson = JSON.stringify(db).replace(/<\/script>/gi, '<\\/script>');
  
  return `<!doctype html>
<html lang="it">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(db.config.siteName)} | Offerte Amazon, App Gratuite e Risorse</title>
  <meta name="description" content="${escapeHtml(db.config.payoff.it)}" />
  <meta property="og:title" content="${escapeHtml(db.config.siteName)}" />
  <meta property="og:description" content="${escapeHtml(db.config.payoff.it)}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <!-- Tailwind CSS CDN for 100% self-contained standalone execution -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brandDark: '#0b1329',
            brandSidebar: '#0f172a',
            brandOrange: '${db.config.primaryAccentColor || '#f97316'}',
            brandBlue: '${db.config.secondaryColor || '#2563eb'}'
          },
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            heading: ['Outfit', '"Plus Jakarta Sans"', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
    h1, h2, h3, h4, h5, .font-heading { font-family: 'Outfit', sans-serif; }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: rgba(15, 23, 42, 0.05); }
    ::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.4); border-radius: 9999px; }
    .logo-circle { object-fit: cover; border-radius: 9999px; aspect-ratio: 1/1; }
  </style>
</head>
<body class="bg-slate-50 text-slate-800 antialiased selection:bg-orange-500 selection:text-white transition-colors duration-200">
  <div id="standalone-app"></div>

  <script>
    // Embedded Active Database State
    window.INITIAL_DB = ${dbJson};
    
    (function() {
      const STORAGE_KEY = 'digital_creator_lab_db_v1';
      const LANG_KEY = 'digital_creator_lab_lang_v1';
      const THEME_KEY = 'digital_creator_lab_theme_v1';
      
      let db = window.INITIAL_DB;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          db = JSON.parse(saved);
        } else {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        }
      } catch(e) {}

      let currentLang = 'it';
      try {
        const savedLang = localStorage.getItem(LANG_KEY);
        if (savedLang === 'en' || savedLang === 'it') currentLang = savedLang;
      } catch(e) {}

      let currentTheme = 'light';
      try {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') currentTheme = savedTheme;
      } catch(e) {}

      let activeSection = 'home';
      let selectedCategory = 'all';
      let searchQuery = '';
      let isModalOpen = false;
      let isAdminOpen = false;
      let isAdminAuthenticated = false;
      let adminActiveTab = 'deals'; // 'deals' | 'site' | 'backend' | 'export'
      let mobileMenuOpen = false;

      function saveDbToStorage() {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        } catch(e) {}
      }

      function formatPrice(num) {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(num);
      }

      function calcDiscount(prev, curr) {
        if (!prev || !curr || prev <= curr) return null;
        return Math.round(((prev - curr) / prev) * 100);
      }

      function render() {
        const app = document.getElementById('standalone-app');
        if (!app) return;

        const isIt = currentLang === 'it';
        const isDark = currentTheme === 'dark';
        
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.body.classList.remove('bg-slate-50', 'text-slate-800');
          document.body.classList.add('bg-[#090d1a]', 'text-slate-100');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('bg-[#090d1a]', 'text-slate-100');
          document.body.classList.add('bg-slate-50', 'text-slate-800');
        }

        const t = (obj) => {
          if (!obj) return '';
          if (typeof obj === 'string') return obj;
          return obj[currentLang] || obj['it'] || '';
        };

        const activeOffers = (db.offers || []).filter(o => o.isPublished !== false);
        const filteredOffers = activeOffers.filter(o => {
          if (selectedCategory !== 'all' && o.categoryId !== selectedCategory) return false;
          if (searchQuery) {
            const title = t(o.title).toLowerCase();
            const desc = t(o.description).toLowerCase();
            if (!title.includes(searchQuery.toLowerCase()) && !desc.includes(searchQuery.toLowerCase())) return false;
          }
          return true;
        });

        const flashOffers = activeOffers.filter(o => o.isFlashDeal);

        app.innerHTML = \`
          <div class="min-h-screen flex flex-col lg:flex-row antialiased">
            <!-- Mobile Top Header -->
            <header class="lg:hidden sticky top-0 z-40 bg-[#0f172a] text-white px-4 py-3 border-b border-slate-800 flex items-center justify-between shadow-md">
              <div class="flex items-center gap-3">
                <img src="\${db.config.logoUrl}" alt="\${t(db.config.siteName)}" class="w-10 h-10 rounded-full border-2 border-orange-500 shadow-sm logo-circle" />
                <div>
                  <h1 class="text-sm font-bold tracking-tight text-white font-heading">\${db.config.siteName}</h1>
                  <p class="text-[10px] text-slate-400 line-clamp-1">\${t(db.config.payoff)}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button id="toggle-theme-mob" class="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-amber-300 font-bold" title="\${isDark ? 'Tema Chiaro' : 'Tema Scuro'}">
                  \${isDark ? '☀️' : '🌙'}
                </button>
                <button id="toggle-lang-mob" class="text-xs px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-semibold text-amber-400">
                  \${isIt ? 'IT' : 'EN'}
                </button>
                <button id="toggle-mobile-menu" class="p-1.5 rounded-lg bg-slate-800 text-white">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </button>
              </div>
            </header>

            <!-- Sidebar Navigation -->
            <aside id="sidebar" class="\${mobileMenuOpen ? 'block' : 'hidden'} lg:block fixed lg:sticky top-0 left-0 z-50 lg:z-30 w-full lg:w-72 h-screen bg-[#0b1329] text-slate-200 border-r border-slate-800/80 flex flex-col justify-between shadow-2xl transition-all">
              <div class="p-5 flex-1 overflow-y-auto">
                <div class="flex items-center justify-between pb-5 border-b border-slate-800">
                  <div class="flex items-center gap-3.5">
                    <img src="\${db.config.logoUrl}" alt="\${db.config.siteName}" class="w-13 h-13 rounded-full border-2 border-orange-500 shadow-lg logo-circle ring-2 ring-orange-500/20" />
                    <div>
                      <h2 class="text-base font-extrabold text-white tracking-wider font-heading leading-tight">\${db.config.siteName}</h2>
                      <span class="inline-block mt-0.5 text-[9px] uppercase tracking-widest px-2 py-0.5 bg-orange-500/10 text-orange-400 font-bold rounded-full border border-orange-500/20">CREATOR HUB</span>
                    </div>
                  </div>
                  <button id="close-mobile-menu" class="lg:hidden text-slate-400 hover:text-white p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>

                <p class="text-xs text-slate-400 mt-3 leading-relaxed">\${t(db.config.payoff)}</p>

                <!-- Language, Theme & Admin Lock Bar -->
                <div class="mt-4 flex items-center justify-between gap-1.5 bg-slate-900/90 rounded-xl p-2 border border-slate-800">
                  <div class="flex items-center gap-1">
                    <button class="lang-btn px-2 py-1 text-xs rounded-lg font-bold transition \${isIt ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}" data-lang="it">IT</button>
                    <button class="lang-btn px-2 py-1 text-xs rounded-lg font-bold transition \${!isIt ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'}" data-lang="en">EN</button>
                  </div>
                  <button id="toggle-theme-side" class="p-1.5 rounded-lg text-xs font-bold bg-slate-800 text-amber-300 hover:bg-slate-700 border border-slate-700/60 transition flex items-center gap-1" title="\${isDark ? 'Tema Chiaro' : 'Tema Scuro'}">
                    <span>\${isDark ? '☀️' : '🌙'}</span>
                    <span class="text-[10px] hidden sm:inline">\${isDark ? (isIt ? 'Chiaro' : 'Light') : (isIt ? 'Scuro' : 'Dark')}</span>
                  </button>
                  <button id="open-admin-btn" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition">
                    <svg class="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a4 4 0 00-4 4v2H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-1V6a4 4 0 00-4-4zm2 6V6a2 2 0 10-4 0v2h4z" clip-rule="evenodd"></path></svg>
                    <span>ADMIN</span>
                  </button>
                </div>

                <!-- Navigation List -->
                <nav class="mt-5 space-y-1">
                  \${[
                    { id: 'home', label: isIt ? 'Home' : 'Home', badge: '' },
                    { id: 'offerte', label: isIt ? 'Offerte Amazon' : 'Amazon Offers', badge: activeOffers.length },
                    { id: 'offerte-lampo', label: isIt ? 'Offerte Lampo' : 'Flash Deals', badge: '⚡ ' + flashOffers.length },
                    { id: 'servizi', label: isIt ? 'Amazon & Servizi' : 'Amazon Services', badge: '9' },
                    { id: 'app', label: isIt ? 'App Gratuite' : 'Free Apps', badge: (db.apps || []).length },
                    { id: 'idee', label: isIt ? 'Idee & Risorse' : 'Ideas & Resources', badge: ((db.ideas || []).length + (db.resources || []).length) }
                  ].map(item => \`
                    <a href="#\${item.id}" class="nav-btn w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition text-slate-300 hover:bg-slate-800/80 hover:text-white">
                      <span>\${item.label}</span>
                      \${item.badge ? \`<span class="text-[11px] px-2 py-0.5 rounded-full font-bold bg-slate-800 text-slate-400">\${item.badge}</span>\` : ''}
                    </a>
                  \`).join('')}
                </nav>
              </div>

              <!-- Sidebar Footer CTA -->
              <div class="p-4 bg-slate-900/90 border-t border-slate-800">
                <button id="open-custom-app-side" class="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition flex items-center justify-center gap-2">
                  <span>✨</span>
                  <span>\${isIt ? 'Vuoi un\\'app così?' : 'Want an app like this?'}</span>
                </button>
              </div>
            </aside>

            <!-- Main Content Area -->
            <main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl">
              <!-- Top Social Bar (Compact, Ordered: WhatsApp Channel, Facebook, YouTube, TikTok, X, WhatsApp Gian) -->
              <div class="\${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-200/80'} rounded-2xl p-3 sm:p-3.5 shadow-sm border flex flex-wrap items-center justify-between gap-2.5">
                <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  \${(db.socialLinks || []).filter(s => s.isVisible !== false).sort((a,b) => (a.order||0) - (b.order||0)).map(soc => \`
                    <a href="\${soc.url}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-xs hover:opacity-95 hover:scale-105 active:scale-95 transition" style="background-color: \${soc.color || '#2563eb'}">
                      <span>\${soc.isWhatsAppChannel ? '🟢' : (soc.iconName === 'facebook' ? '🔵' : (soc.iconName === 'youtube' ? '🔴' : (soc.iconName === 'tiktok' ? '🎵' : (soc.iconName === 'x' ? '✖️' : '📲'))))}</span>
                      <span class="tracking-tight uppercase font-heading">\${t(soc.label)}</span>
                    </a>
                  \`).join('')}
                </div>
                <div>
                  <button id="open-custom-app-top" class="px-3.5 py-1.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm transition">
                    \${isIt ? 'VUOI UN\\'APP COSÌ?' : 'WANT AN APP LIKE THIS?'}
                  </button>
                </div>
              </div>

              <!-- Hero Promotional Banner -->
              \${db.config.heroBanner && db.config.heroBanner.isVisible ? \`
                <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white p-6 lg:p-10 shadow-xl border border-slate-800">
                  <div class="relative z-10 max-w-2xl">
                    <span class="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-orange-500/20 text-orange-400 border border-orange-500/30 mb-3">
                      \${t(db.config.heroBanner.badge)}
                    </span>
                    <h2 class="text-2xl lg:text-4xl font-extrabold tracking-tight font-heading leading-tight">
                      \${t(db.config.heroBanner.title)}
                    </h2>
                    <p class="mt-3 text-sm lg:text-base text-slate-300 leading-relaxed">
                      \${t(db.config.heroBanner.subtitle)}
                    </p>
                    <div class="mt-6 flex flex-wrap gap-3">
                      <a href="#offerte" class="px-6 py-3 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-lg hover:bg-orange-600 transition">
                        \${t(db.config.heroBanner.buttonText)}
                      </a>
                      <a href="https://whatsapp.com/channel/0029Vb8tqXaB4hdRxxjPkp3C" target="_blank" rel="noopener noreferrer" class="px-5 py-3 rounded-xl bg-slate-800 text-slate-200 font-bold text-sm border border-slate-700 hover:bg-slate-700 transition flex items-center gap-2">
                        <span>📲</span>
                        <span>\${isIt ? 'Canale WhatsApp Ufficiale' : 'Official WhatsApp Channel'}</span>
                      </a>
                    </div>
                  </div>
                </div>
              \` : ''}

              <!-- Free App of the Week Spotlight -->
              \${db.config.freeAppOfTheWeek && db.config.freeAppOfTheWeek.isVisible ? \`
                <div class="\${isDark ? 'bg-slate-900/60 border-orange-500/30' : 'bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border-orange-500/30'} border-2 rounded-3xl p-6 lg:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-sm">
                  <div class="space-y-2 max-w-2xl">
                    <span class="px-3 py-1 rounded-full text-[10px] font-extrabold bg-orange-500 text-white uppercase tracking-wider">
                      ⚡ \${t(db.config.freeAppOfTheWeek.badge)}
                    </span>
                    <h3 class="text-xl lg:text-2xl font-bold font-heading \${isDark ? 'text-white' : 'text-slate-900'}">
                      \${t(db.config.freeAppOfTheWeek.title)}
                    </h3>
                    <p class="text-sm \${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed">
                      \${t(db.config.freeAppOfTheWeek.description)}
                    </p>
                  </div>
                  <div>
                    <a href="\${db.config.freeAppOfTheWeek.linkUrl}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition">
                      <span>📲</span>
                      <span>\${t(db.config.freeAppOfTheWeek.buttonText)}</span>
                    </a>
                  </div>
                </div>
              \` : ''}

              <!-- Amazon & Services Quick Buttons (Compact, essential titles) -->
              <section id="servizi" class="space-y-3">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-bold font-heading flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}">
                    <span class="text-orange-500">🛍️</span>
                    <span>\${isIt ? 'Amazon & Servizi Disponibili' : 'Amazon & Available Services'}</span>
                  </h3>
                  <span class="text-xs \${isDark ? 'text-slate-400' : 'text-slate-500'}">\${isIt ? 'Accesso diretto e vantaggi verificati' : 'Direct access & verified perks'}</span>
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                  \${(db.services || []).filter(s => s.isVisible !== false).map(srv => \`
                    <a href="\${srv.url}" target="_blank" rel="nofollow noopener sponsored" class="flex flex-col items-center justify-center text-center p-3.5 \${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100 hover:bg-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:bg-slate-900 hover:text-white'} rounded-xl border shadow-sm transition group">
                      <span class="text-xs font-bold leading-snug group-hover:text-amber-400">\${t(srv.label)}</span>
                      \${srv.badge ? \`<span class="mt-1 text-[10px] px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 group-hover:bg-orange-500 group-hover:text-white font-medium">\${t(srv.badge)}</span>\` : ''}
                    </a>
                  \`).join('')}
                </div>
              </section>

              <!-- Amazon Deals Section (NO PRODUCT PHOTOS, mathematical discount, affiliate links) -->
              <section id="offerte" class="space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b \${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3">
                  <div>
                    <h3 class="text-xl font-extrabold font-heading flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}">
                      <span class="text-orange-500">🔥</span>
                      <span>\${isIt ? 'Offerte Selezionate Amazon' : 'Curated Amazon Deals'}</span>
                    </h3>
                    <p class="text-xs \${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5">\${isIt ? 'Schede trasparenti, sconti matematici, senza immagini superflue.' : 'Transparent cards, mathematical discounts, clean layout.'}</p>
                  </div>
                  <!-- Search & Filter bar -->
                  <div class="flex items-center gap-2">
                    <input type="text" id="deal-search" placeholder="\${isIt ? 'Cerca offerta...' : 'Search deals...'}" value="\${searchQuery}" class="px-3 py-1.5 text-xs rounded-xl border \${isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-500" />
                    <select id="deal-category-filter" class="px-3 py-1.5 text-xs rounded-xl border \${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-300 text-slate-900'} focus:outline-none focus:ring-2 focus:ring-orange-500">
                      <option value="all">\${isIt ? 'Tutte le Categorie' : 'All Categories'}</option>
                      \${(db.categories || []).map(c => \`<option value="\${c.id}" \${selectedCategory === c.id ? 'selected' : ''}>\${t(c.name)}</option>\`).join('')}
                    </select>
                  </div>
                </div>

                <!-- Products Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  \${filteredOffers.length === 0 ? \`
                    <div class="col-span-full py-12 text-center \${isDark ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-300'} rounded-2xl border border-dashed">
                      <p class="\${isDark ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium">\${isIt ? 'Nessuna offerta trovata per questi filtri.' : 'No deals found for these filters.'}</p>
                    </div>
                  \` : filteredOffers.map(offer => {
                    const discount = calcDiscount(offer.previousPrice, offer.currentPrice) || offer.discountPercent;
                    const category = (db.categories || []).find(c => c.id === offer.categoryId);
                    return \`
                      <div class="\${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200/90 text-slate-800'} rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col justify-between p-5 space-y-4">
                        <div>
                          <div class="flex items-center justify-between gap-2">
                            \${category ? \`<span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full \${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}">\${t(category.name)}</span>\` : '<span></span>'}
                            <div class="flex items-center gap-1.5">
                              \${offer.isFlashDeal ? \`<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 animate-pulse">⚡ \${isIt ? 'LAMPO' : 'FLASH'}</span>\` : ''}
                              \${offer.isFeatured ? \`<span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">★ TOP</span>\` : ''}
                            </div>
                          </div>
                          
                          <h4 class="mt-3 text-base font-bold font-heading line-clamp-2 leading-snug \${isDark ? 'text-white' : 'text-slate-900'}">
                            \${t(offer.title)}
                          </h4>
                          <p class="mt-2 text-xs \${isDark ? 'text-slate-300' : 'text-slate-600'} line-clamp-3 leading-relaxed">
                            \${t(offer.description)}
                          </p>
                        </div>

                        <div class="pt-3 border-t \${isDark ? 'border-slate-800' : 'border-slate-100'} space-y-3">
                          <div class="flex items-baseline justify-between">
                            <div>
                              <div class="text-2xl font-black font-heading \${isDark ? 'text-white' : 'text-slate-900'}">
                                \${formatPrice(offer.currentPrice)}
                              </div>
                              \${offer.previousPrice ? \`
                                <div class="text-xs text-slate-400 line-through">
                                  \${formatPrice(offer.previousPrice)}
                                </div>
                              \` : ''}
                            </div>
                            \${discount ? \`
                              <span class="px-2.5 py-1 rounded-xl text-xs font-black bg-emerald-500 text-white shadow-sm">
                                -\${discount}%
                              </span>
                            \` : ''}
                          </div>

                          <a href="\${offer.affiliateLink}" target="_blank" rel="nofollow noopener sponsored" class="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs tracking-wider uppercase text-center block shadow-md hover:shadow-lg transition">
                            \${isIt ? 'SCOPRI L\\'OFFERTA SU AMAZON' : 'VIEW DEAL ON AMAZON'} →
                          </a>
                        </div>
                      </div>
                    \`;
                  }).join('')}
                </div>

                <!-- Mandatory Affiliate Disclaimer -->
                <div class="mt-6 p-3.5 \${isDark ? 'bg-slate-900/80 border-slate-800 text-slate-400' : 'bg-slate-100/80 border-slate-200 text-slate-600'} rounded-xl text-center border">
                  <p class="text-[11px] italic">
                    "\${t(db.config.affiliateDisclaimer)}"
                  </p>
                </div>
              </section>

              <!-- Free Apps Section -->
              <section id="app" class="space-y-4">
                <div class="border-b \${isDark ? 'border-slate-800' : 'border-slate-200'} pb-3">
                  <h3 class="text-xl font-extrabold font-heading flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}">
                    <span class="text-emerald-500">📱</span>
                    <span>\${isIt ? 'Applicazioni Gratuite del Lab' : 'Lab Free Web Applications'}</span>
                  </h3>
                  <p class="text-xs \${isDark ? 'text-slate-400' : 'text-slate-500'} mt-0.5">\${isIt ? 'Web app create per semplificare il lavoro digitale e dei creator.' : 'Tools created to simplify digital tasks and content creation.'}</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                  \${(db.apps || []).map(app => \`
                    <div class="\${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} rounded-2xl p-5 border shadow-sm flex flex-col justify-between space-y-3">
                      <div>
                        \${app.badge ? \`<span class="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">\${t(app.badge)}</span>\` : ''}
                        <h4 class="mt-2 text-base font-bold font-heading \${isDark ? 'text-white' : 'text-slate-900'}">\${t(app.title)}</h4>
                        <p class="mt-1 text-xs \${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed">\${t(app.description)}</p>
                      </div>
                      <a href="\${app.destinationUrl}" target="_blank" rel="noopener noreferrer" class="py-2.5 px-3 rounded-xl \${isDark ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-slate-800'} text-white font-bold text-xs text-center transition">
                        \${isIt ? 'APRI APPLICAZIONE' : 'LAUNCH APP'} →
                      </a>
                    </div>
                  \`).join('')}
                </div>
              </section>

              <!-- Ideas and Resources -->
              <div id="idee" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Idee -->
                <section class="\${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} rounded-2xl p-6 border shadow-sm space-y-4">
                  <h3 class="text-lg font-bold font-heading flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}">
                    <span class="text-amber-500">💡</span>
                    <span>\${isIt ? 'Idee & Progetti Digitali' : 'Digital Ideas & Concepts'}</span>
                  </h3>
                  <div class="space-y-3">
                    \${(db.ideas || []).map(idea => \`
                      <div class="p-3.5 rounded-xl \${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'} border space-y-2">
                        <h5 class="text-sm font-bold \${isDark ? 'text-white' : 'text-slate-900'}">\${t(idea.title)}</h5>
                        <p class="text-xs \${isDark ? 'text-slate-300' : 'text-slate-600'}">\${t(idea.description)}</p>
                        \${idea.conceptTags ? \`
                          <div class="flex flex-wrap gap-1">
                            \${idea.conceptTags.map(tg => \`<span class="text-[10px] px-2 py-0.5 rounded \${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'} font-medium">#\${tg}</span>\`).join('')}
                          </div>
                        \` : ''}
                      </div>
                    \`).join('')}
                  </div>
                </section>

                <!-- Risorse -->
                <section class="\${isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} rounded-2xl p-6 border shadow-sm space-y-4">
                  <h3 class="text-lg font-bold font-heading flex items-center gap-2 \${isDark ? 'text-white' : 'text-slate-900'}">
                    <span class="text-blue-500">📁</span>
                    <span>\${isIt ? 'Risorse Digitali & Download' : 'Digital Resources & Downloads'}</span>
                  </h3>
                  <div class="space-y-3">
                    \${(db.resources || []).map(res => \`
                      <div class="p-3.5 rounded-xl \${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200/80'} border flex items-center justify-between gap-3">
                        <div>
                          <h5 class="text-sm font-bold \${isDark ? 'text-white' : 'text-slate-900'}">\${t(res.title)}</h5>
                          <p class="text-xs \${isDark ? 'text-slate-300' : 'text-slate-600'} line-clamp-1">\${t(res.description)}</p>
                          <span class="text-[10px] text-blue-500 font-semibold">\${res.fileInfo || 'Download'}</span>
                        </div>
                        <a href="\${res.destinationUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition shrink-0">
                          Scarica
                        </a>
                      </div>
                    \`).join('')}
                  </div>
                </section>
              </div>

              <!-- White-label Custom App Banner -->
              <section class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="space-y-2 text-center sm:text-left max-w-xl">
                  <span class="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 text-white">
                    \${isIt ? 'SOLUZIONE WHITE-LABEL' : 'WHITE-LABEL SOLUTION'}
                  </span>
                  <h3 class="text-xl sm:text-2xl font-black font-heading leading-tight">
                    \${isIt
                      ? 'Vuoi un portale come DIGITAL CREATOR LAB con il tuo nome e le tue offerte?'
                      : 'Want a portal like DIGITAL CREATOR LAB with your name and deals?'}
                  </h3>
                  <p class="text-xs sm:text-sm text-orange-100">
                    \${isIt
                      ? 'Personalizzabile al 100%: logo circolare, colori aziendali, link affiliati e pannello ADMIN riservato.'
                      : '100% customizable: circular logo, company branding, affiliate tags, and private ADMIN laboratory.'}
                  </p>
                </div>
                <div class="shrink-0">
                  <button id="open-custom-app-bottom" class="px-6 py-3.5 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition">
                    \${isIt ? 'VUOI UN\\'APP COSÌ?' : 'WANT AN APP LIKE THIS?'} →
                  </button>
                </div>
              </section>

              <!-- Footer -->
              <footer class="pt-8 border-t \${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'} flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div class="flex items-center gap-2">
                  <img src="\${db.config.logoUrl}" alt="\${db.config.siteName}" class="w-6 h-6 rounded-full logo-circle border border-orange-500" />
                  <span class="font-bold \${isDark ? 'text-slate-300' : 'text-slate-700'}">\${db.config.siteName}</span>
                  <span>© \${new Date().getFullYear()}</span>
                </div>
                <div class="flex items-center gap-4">
                  <button id="footer-admin-btn" class="hover:text-orange-500 transition font-semibold">
                    \${isIt ? 'Pannello Amministratore (PIN 8873)' : 'Admin Panel (PIN 8873)'}
                  </button>
                </div>
              </footer>
            </main>
          </div>

          <!-- VUOI UN'APP COSI? Modal (Direct WhatsApp Contact to Gian: 380 587 2089) -->
          <div id="custom-app-modal" class="\${isModalOpen ? 'flex' : 'hidden'} fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm items-center justify-center p-4">
            <div class="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center space-y-5">
              <div class="w-14 h-14 bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto shadow-inner">
                📲
              </div>
              <div>
                <h3 class="text-2xl font-black text-slate-900 dark:text-white font-heading">
                  \${t(db.config.customAppModal.title)}
                </h3>
                <p class="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  \${t(db.config.customAppModal.description)}
                </p>
              </div>
              <div class="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
                \${t(db.config.customAppModal.contactLabel)}
              </div>
              <div class="space-y-2">
                <a href="https://wa.me/\${db.config.personalWhatsAppNumber}" target="_blank" rel="noopener noreferrer" class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-wide uppercase shadow-lg block transition">
                  \${t(db.config.customAppModal.buttonText)}
                </a>
                <button id="close-modal-btn" class="w-full py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-bold transition">
                  \${t(db.config.customAppModal.closeText)}
                </button>
              </div>
            </div>
          </div>

          <!-- ADMIN PANEL MODAL (PIN Protected: 8873) -->
          <div id="admin-modal" class="\${isAdminOpen ? 'flex' : 'hidden'} fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm items-center justify-center p-4">
            <div class="bg-white dark:bg-[#0f172a] rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 overflow-hidden">
              <!-- Admin Header -->
              <div class="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                <div class="flex items-center gap-2.5">
                  <span class="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <h3 class="font-black text-base font-heading">PANNELLO AMMINISTRATORE (CODICE 8873 AUTORIZZATO)</h3>
                </div>
                <button id="close-admin-btn" class="text-slate-400 hover:text-white p-1 rounded-lg">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>

              <!-- Admin Tabs -->
              <div class="px-6 pt-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex gap-2 overflow-x-auto text-xs font-bold">
                <button class="admin-tab-btn py-2 px-3 rounded-t-lg transition \${adminActiveTab === 'deals' ? 'bg-white dark:bg-[#0f172a] text-orange-600 border-t-2 border-orange-500 shadow-xs' : 'text-slate-600 dark:text-slate-400'}" data-tab="deals">Offerte Amazon (\${(db.offers || []).length})</button>
                <button class="admin-tab-btn py-2 px-3 rounded-t-lg transition \${adminActiveTab === 'site' ? 'bg-white dark:bg-[#0f172a] text-orange-600 border-t-2 border-orange-500 shadow-xs' : 'text-slate-600 dark:text-slate-400'}" data-tab="site">Identità Sito & Logo</button>
                <button class="admin-tab-btn py-2 px-3 rounded-t-lg transition \${adminActiveTab === 'backend' ? 'bg-white dark:bg-[#0f172a] text-orange-600 border-t-2 border-orange-500 shadow-xs' : 'text-slate-600 dark:text-slate-400'}" data-tab="backend">Backend & GitHub Pages</button>
                <button class="admin-tab-btn py-2 px-3 rounded-t-lg transition \${adminActiveTab === 'export' ? 'bg-white dark:bg-[#0f172a] text-orange-600 border-t-2 border-orange-500 shadow-xs' : 'text-slate-600 dark:text-slate-400'}" data-tab="export">Salva & Scarica index.html</button>
              </div>

              <!-- Admin Body Content -->
              <div class="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
                \${adminActiveTab === 'deals' ? \`
                  <div class="space-y-4">
                    <div class="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-2xl border border-orange-200 dark:border-orange-800/40 space-y-3">
                      <h4 class="font-bold text-orange-900 dark:text-orange-300 text-sm">➕ Aggiungi Nuova Offerta Amazon</h4>
                      <p class="text-[11px] text-orange-800 dark:text-orange-400">Ricorda: zero foto prodotto per conformità Amazon. Il calcolo percentuale dello sconto è automatico: ((prezzo prec - prezzo att) / prezzo prec) * 100.</p>
                      
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label class="block font-semibold mb-1">Titolo Offerta (IT)</label>
                          <input type="text" id="new-offer-title-it" placeholder="es. Echo Dot (5ª gen) - Altoparlante Intelligente" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                        </div>
                        <div>
                          <label class="block font-semibold mb-1">Titolo Offerta (EN)</label>
                          <input type="text" id="new-offer-title-en" placeholder="e.g. Echo Dot (5th gen) - Smart Speaker" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                        </div>
                        <div>
                          <label class="block font-semibold mb-1">Prezzo Attuale (€)</label>
                          <input type="number" step="0.01" id="new-offer-curr-price" placeholder="34.99" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                        </div>
                        <div>
                          <label class="block font-semibold mb-1">Prezzo Precedente (€) [Opzionale]</label>
                          <input type="number" step="0.01" id="new-offer-prev-price" placeholder="64.99" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                        </div>
                        <div class="sm:col-span-2">
                          <label class="block font-semibold mb-1">Link Affiliato Amazon Completo</label>
                          <input type="url" id="new-offer-link" placeholder="https://www.amazon.it/dp/B09B8W5FW7?tag=tuo_tag_affiliato-21" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                        </div>
                        <div class="sm:col-span-2">
                          <label class="block font-semibold mb-1">Descrizione Breve (IT)</label>
                          <textarea id="new-offer-desc-it" rows="2" placeholder="Descrizione delle caratteristiche principali..." class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800"></textarea>
                        </div>
                        <div class="flex items-center gap-2">
                          <input type="checkbox" id="new-offer-flash" class="rounded text-orange-500" />
                          <label for="new-offer-flash" class="font-bold">Contrassegna come Offerta Lampo ⚡</label>
                        </div>
                      </div>

                      <button id="save-new-offer-btn" class="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition">
                        Aggiungi Offerta al Database
                      </button>
                    </div>

                    <h4 class="font-bold text-sm">Elenco Offerte Attive (\${(db.offers || []).length})</h4>
                    <div class="space-y-2">
                      \${(db.offers || []).map(o => \`
                        <div class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                          <div class="min-w-0">
                            <p class="font-bold truncate text-sm">\${t(o.title)}</p>
                            <p class="text-slate-500 dark:text-slate-400 text-[11px]">\${formatPrice(o.currentPrice)} \${o.previousPrice ? \`(era \${formatPrice(o.previousPrice)})\` : ''}</p>
                          </div>
                          <button class="delete-offer-btn px-2.5 py-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg font-bold" data-id="\${o.id}">
                            Elimina
                          </button>
                        </div>
                      \`).join('')}
                    </div>
                  </div>
                \` : ''}

                \${adminActiveTab === 'site' ? \`
                  <div class="space-y-4">
                    <div>
                      <label class="block font-semibold mb-1">Nome Sito</label>
                      <input type="text" id="edit-site-name" value="\${db.config.siteName}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label class="block font-semibold mb-1">Payoff (IT)</label>
                      <input type="text" id="edit-payoff-it" value="\${db.config.payoff.it}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label class="block font-semibold mb-1">URL Logo Circolare</label>
                      <input type="text" id="edit-logo-url" value="\${db.config.logoUrl}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                    </div>
                    <div>
                      <label class="block font-semibold mb-1">Numero WhatsApp Personale (per popup Vuoi un'app così?)</label>
                      <input type="text" id="edit-whatsapp" value="\${db.config.personalWhatsAppNumber}" class="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-700 dark:bg-slate-800" />
                    </div>
                    <button id="save-site-config-btn" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition">
                      Salva Modifiche Sito
                    </button>
                  </div>
                \` : ''}

                \${adminActiveTab === 'backend' ? \`
                  <div class="space-y-3 leading-relaxed">
                    <h4 class="font-bold text-sm">Guida Pubblicazione GitHub Pages & Backend Esterno</h4>
                    <p>Per pubblicare su GitHub Pages in 2 minuti:</p>
                    <ol class="list-decimal pl-5 space-y-1 text-slate-600 dark:text-slate-300">
                      <li>Crea un repository pubblico su GitHub chiamato ad esempio <code>digital-creator-lab</code></li>
                      <li>Carica direttamente questo file <code>index.html</code> nella radice del repository</li>
                      <li>Vai su <strong>Settings > Pages</strong>, seleziona Branch <code>main</code> e cartella <code>/ (root)</code></li>
                      <li>Il sito sarà subito online con HTTPS e certificato gratuito!</li>
                    </ol>

                    <div class="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2 mt-3">
                      <h5 class="font-bold text-blue-900 dark:text-blue-300">Integrazione Cloud Database (Supabase o Firebase)</h5>
                      <p class="text-[11px] text-blue-800 dark:text-blue-400">
                        Attualmente le modifiche vengono salvate in <code>localStorage</code> del browser dell'amministratore e scaricabili come file <code>index.html</code> autonomo con il nuovo database incorporato.
                        Per consentire a visitatori multipli di vedere modifiche in tempo reale senza ricaricare il file su GitHub, puoi attivare Supabase o Firebase inserendo le credenziali pubbliche (anonKey e URL) nel config.
                      </p>
                    </div>
                  </div>
                \` : ''}

                \${adminActiveTab === 'export' ? \`
                  <div class="p-5 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-200 dark:border-emerald-800/40 text-center space-y-4">
                    <h4 class="font-bold text-emerald-950 dark:text-emerald-300 text-base">Esporta & Scarica index.html Completo</h4>
                    <p class="text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                      Clicca sul pulsante in basso per generare e scaricare sul tuo computer (nella cartella Download) il nuovo file <strong>index.html</strong> con tutti i dati, le offerte e le configurazioni aggiornate!
                    </p>
                    <button id="download-updated-index-btn" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm uppercase tracking-wider rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition inline-flex items-center gap-2">
                      <span>📥</span>
                      <span>Scarica Nuovo index.html Aggiornato</span>
                    </button>
                  </div>
                \` : ''}
              </div>
            </div>
          </div>
        \`;

        // Attach event handlers
        document.querySelectorAll('.lang-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            currentLang = btn.dataset.lang;
            localStorage.setItem(LANG_KEY, currentLang);
            render();
          });
        });

        const toggleMob = document.getElementById('toggle-lang-mob');
        if (toggleMob) {
          toggleMob.addEventListener('click', () => {
            currentLang = currentLang === 'it' ? 'en' : 'it';
            localStorage.setItem(LANG_KEY, currentLang);
            render();
          });
        }

        const openModalButtons = ['open-custom-app-side', 'open-custom-app-top', 'open-custom-app-bottom'];
        openModalButtons.forEach(id => {
          const btn = document.getElementById(id);
          if (btn) btn.addEventListener('click', () => { isModalOpen = true; render(); });
        });

        const closeModalBtn = document.getElementById('close-modal-btn');
        if (closeModalBtn) closeModalBtn.addEventListener('click', () => { isModalOpen = false; render(); });

        const toggleMobileMenu = document.getElementById('toggle-mobile-menu');
        if (toggleMobileMenu) toggleMobileMenu.addEventListener('click', () => { mobileMenuOpen = !mobileMenuOpen; render(); });

        const closeMobileMenu = document.getElementById('close-mobile-menu');
        if (closeMobileMenu) closeMobileMenu.addEventListener('click', () => { mobileMenuOpen = false; render(); });

        const dealSearch = document.getElementById('deal-search');
        if (dealSearch) {
          dealSearch.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            render();
          });
        }

        const dealFilter = document.getElementById('deal-category-filter');
        if (dealFilter) {
          dealFilter.addEventListener('change', (e) => {
            selectedCategory = e.target.value;
            render();
          });
        }

        // Theme toggle handlers
        const handleThemeToggle = () => {
          currentTheme = currentTheme === 'light' ? 'dark' : 'light';
          localStorage.setItem(THEME_KEY, currentTheme);
          render();
        };

        const toggleThemeMob = document.getElementById('toggle-theme-mob');
        if (toggleThemeMob) toggleThemeMob.addEventListener('click', handleThemeToggle);

        const toggleThemeSide = document.getElementById('toggle-theme-side');
        if (toggleThemeSide) toggleThemeSide.addEventListener('click', handleThemeToggle);

        // Admin Auth Flow (PIN 8873)
        const triggerAdminAccess = () => {
          if (isAdminAuthenticated) {
            isAdminOpen = true;
            render();
            return;
          }
          const pass = prompt(isIt ? 'ACCESSO RISERVATO AMMINISTRATORE\\n\\nInserisci il codice di sicurezza (PIN):' : 'RESTRICTED ADMIN ACCESS\\n\\nEnter security code (PIN):');
          if (pass === '8873') {
            isAdminAuthenticated = true;
            isAdminOpen = true;
            render();
          } else if (pass !== null) {
            alert(isIt ? 'Codice di sicurezza non valido. Solo l\\'amministratore può modificare il portale.' : 'Invalid security code. Access denied.');
          }
        };

        const openAdminBtn = document.getElementById('open-admin-btn');
        if (openAdminBtn) openAdminBtn.addEventListener('click', triggerAdminAccess);

        const footerAdminBtn = document.getElementById('footer-admin-btn');
        if (footerAdminBtn) footerAdminBtn.addEventListener('click', triggerAdminAccess);

        const closeAdminBtn = document.getElementById('close-admin-btn');
        if (closeAdminBtn) closeAdminBtn.addEventListener('click', () => { isAdminOpen = false; render(); });

        // Admin Tab switching
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            adminActiveTab = btn.dataset.tab;
            render();
          });
        });

        // Admin Save New Offer
        const saveNewOfferBtn = document.getElementById('save-new-offer-btn');
        if (saveNewOfferBtn) {
          saveNewOfferBtn.addEventListener('click', () => {
            const titleIt = (document.getElementById('new-offer-title-it')?.value || '').trim();
            const titleEn = (document.getElementById('new-offer-title-en')?.value || '').trim() || titleIt;
            const currPrice = parseFloat(document.getElementById('new-offer-curr-price')?.value || '0');
            const prevPriceVal = document.getElementById('new-offer-prev-price')?.value;
            const prevPrice = prevPriceVal ? parseFloat(prevPriceVal) : undefined;
            const link = (document.getElementById('new-offer-link')?.value || '').trim();
            const descIt = (document.getElementById('new-offer-desc-it')?.value || '').trim();
            const isFlash = document.getElementById('new-offer-flash')?.checked || false;

            if (!titleIt || !currPrice || !link) {
              alert(isIt ? 'Compila titolo, prezzo attuale e link affiliato.' : 'Please fill in title, price and affiliate link.');
              return;
            }

            const newOffer = {
              id: 'deal-' + Date.now(),
              title: { it: titleIt, en: titleEn },
              description: { it: descIt, en: descIt },
              currentPrice: currPrice,
              previousPrice: prevPrice,
              categoryId: 'tech',
              affiliateLink: link,
              isFlashDeal: isFlash,
              isFeatured: true,
              isPublished: true,
              createdAt: new Date().toISOString()
            };

            db.offers = [newOffer, ...(db.offers || [])];
            saveDbToStorage();
            alert(isIt ? 'Offerta aggiunta con successo!' : 'Offer added successfully!');
            render();
          });
        }

        // Admin Delete Offer
        document.querySelectorAll('.delete-offer-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const id = btn.dataset.id;
            if (confirm(isIt ? 'Sei sicuro di voler eliminare questa offerta?' : 'Are you sure you want to delete this offer?')) {
              db.offers = (db.offers || []).filter(o => o.id !== id);
              saveDbToStorage();
              render();
            }
          });
        });

        // Admin Save Site Config
        const saveSiteConfigBtn = document.getElementById('save-site-config-btn');
        if (saveSiteConfigBtn) {
          saveSiteConfigBtn.addEventListener('click', () => {
            const newName = document.getElementById('edit-site-name')?.value || db.config.siteName;
            const newPayoff = document.getElementById('edit-payoff-it')?.value || db.config.payoff.it;
            const newLogo = document.getElementById('edit-logo-url')?.value || db.config.logoUrl;
            const newWa = document.getElementById('edit-whatsapp')?.value || db.config.personalWhatsAppNumber;

            db.config.siteName = newName;
            db.config.payoff.it = newPayoff;
            db.config.logoUrl = newLogo;
            db.config.personalWhatsAppNumber = newWa;

            saveDbToStorage();
            alert(isIt ? 'Configurazione salvata con successo!' : 'Configuration saved successfully!');
            render();
          });
        }

        // Admin Download Updated Standalone HTML
        const downloadUpdatedBtn = document.getElementById('download-updated-index-btn');
        if (downloadUpdatedBtn) {
          downloadUpdatedBtn.addEventListener('click', () => {
            // Re-generate fresh standalone HTML embedding current db state
            const htmlSource = document.documentElement.outerHTML;
            // Inject new db json into INITIAL_DB
            const updatedJson = JSON.stringify(db).replace(/<\\/script>/gi, '<\\\\/script>');
            const regex = /window\\.INITIAL_DB\\s*=\\s*\\{[\\s\\S]*?\\};/;
            const newHtml = '<!doctype html>\\n' + htmlSource.replace(regex, 'window.INITIAL_DB = ' + updatedJson + ';');

            const blob = new Blob([newHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'index.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
          });
        }
      }

      window.addEventListener('DOMContentLoaded', render);
      render();
    })();
  </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
