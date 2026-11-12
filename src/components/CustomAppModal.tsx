import React from 'react';
import { X, MessageCircle } from 'lucide-react';
import { SiteConfig, Language } from '../types';

interface CustomAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  lang: Language;
}

export const CustomAppModal: React.FC<CustomAppModalProps> = ({
  isOpen,
  onClose,
  config,
  lang,
}) => {
  if (!isOpen) return null;

  const modalData = config.customAppModal;
  const title = modalData.title[lang] || modalData.title.it;
  const description = modalData.description[lang] || modalData.description.it;
  const contact = modalData.contactLabel[lang] || modalData.contactLabel.it;
  const buttonText = modalData.buttonText[lang] || modalData.buttonText.it;
  const closeText = modalData.closeText[lang] || modalData.closeText.it;

  const whatsappUrl = `https://wa.me/${config.personalWhatsAppNumber}?text=${encodeURIComponent(
    lang === 'it'
      ? 'Ciao Gian! Ho visto Digital Creator Lab e vorrei informazioni per realizzare un portale web personalizzato simile per la mia attività.'
      : 'Hello Gian! I saw Digital Creator Lab and would like information on getting a customized web portal for my business.'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          aria-label={closeText}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shadow-inner">
          <MessageCircle className="w-8 h-8" />
        </div>

        {/* Title & Description */}
        <div className="space-y-3">
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Contact Badge */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 text-sm font-bold text-slate-800 flex items-center justify-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span>{contact}</span>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{buttonText}</span>
          </a>

          <button
            onClick={onClose}
            className="w-full py-3 px-4 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold uppercase tracking-wider hover:bg-slate-100 transition"
          >
            {closeText}
          </button>
        </div>
      </div>
    </div>
  );
};
