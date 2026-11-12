import React from 'react';
import {
  Youtube,
  Facebook,
  Twitter,
  MessageCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { SocialLink, Language } from '../types';

interface SocialBarProps {
  socialLinks: SocialLink[];
  lang: Language;
  onOpenCustomAppModal: () => void;
}

export const SocialBar: React.FC<SocialBarProps> = ({
  socialLinks,
  lang,
  onOpenCustomAppModal,
}) => {
  const isIt = lang === 'it';

  const visibleLinks = [...socialLinks]
    .filter((s) => s.isVisible !== false)
    .sort((a, b) => a.order - b.order);

  const renderIcon = (iconName: string, isWhatsAppChannel?: boolean) => {
    switch (iconName) {
      case 'youtube':
        return <Youtube className="w-3.5 h-3.5 fill-current" />;
      case 'facebook':
        return <Facebook className="w-3.5 h-3.5 fill-current" />;
      case 'twitter':
        return <Twitter className="w-3.5 h-3.5 fill-current" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 fill-current" />;
      case 'tiktok':
        return (
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.72 1.25-.09 2.37-.88 2.8-2.07.24-.65.29-1.37.29-2.07l.02-16.82z" />
          </svg>
        );
      default:
        return <ExternalLink className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-3.5 shadow-xs border border-slate-200/90 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 transition-colors">
      {/* Social links row - compact, orderly, no hidden buttons */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {visibleLinks.map((item) => {
          const label = item.label[lang] || item.label.it;
          const isChannel = item.isWhatsAppChannel;

          return (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white shadow-xs hover:shadow-sm hover:scale-105 active:scale-95 transition shrink-0 ${
                isChannel ? 'ring-2 ring-[#25D366]/40 font-black' : ''
              }`}
              style={{ backgroundColor: item.color || '#2563eb' }}
              title={label}
            >
              {renderIcon(item.iconName, item.isWhatsAppChannel)}
              <span className="tracking-tight uppercase font-heading">{label}</span>
            </a>
          );
        })}
      </div>

      {/* Prominent Custom App Button - compact and aligned */}
      <div className="shrink-0 ml-auto sm:ml-0">
        <button
          onClick={onOpenCustomAppModal}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-[11px] uppercase tracking-wider shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{isIt ? "VUOI UN'APP COSÌ?" : 'WANT AN APP LIKE THIS?'}</span>
        </button>
      </div>
    </div>
  );
};
