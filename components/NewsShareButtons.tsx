import React, { useState } from 'react';
import { 
  Facebook, 
  MessageCircle, 
  Share2, 
  Linkedin, 
  Send, 
  Copy, 
  Check,
  Twitter
} from 'lucide-react';
import { 
  shareToFacebook, 
  shareToWhatsApp, 
  shareToTwitter, 
  shareToLinkedIn, 
  shareToTelegram, 
  copyToClipboard,
  shareViaWeb,
  ShareOptions 
} from '../lib/socialShare';

interface NewsShareButtonsProps {
  newsItem: {
    id: string | number;
    title: string;
    excerpt: string;
    image_url: string;
  };
  compact?: boolean;
}

const NewsShareButtons: React.FC<NewsShareButtonsProps> = ({ newsItem, compact = false }) => {
  const [copied, setCopied] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const shareOptions: ShareOptions = {
    title: newsItem.title,
    description: newsItem.excerpt,
    imageUrl: newsItem.image_url,
    url: `${window.location.origin}?newsId=${newsItem.id}`,
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(shareOptions);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareButtons = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => shareToFacebook(shareOptions),
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      onClick: () => shareToWhatsApp(shareOptions),
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'bg-slate-800 hover:bg-slate-900',
      onClick: () => shareToTwitter(shareOptions),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-sky-700 hover:bg-sky-800',
      onClick: () => shareToLinkedIn(shareOptions),
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: Send,
      color: 'bg-cyan-600 hover:bg-cyan-700',
      onClick: () => shareToTelegram(shareOptions),
    },
  ];

  if (compact) {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {shareButtons.slice(0, 3).map((btn) => (
          <button
            key={btn.id}
            onClick={btn.onClick}
            className={`${btn.color} text-white p-2 rounded-lg transition-all hover:scale-110 active:scale-95`}
            title={`Bagikan ke ${btn.name}`}
            aria-label={`Bagikan ke ${btn.name}`}
          >
            <btn.icon className="h-4 w-4" />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 lg:gap-6">
      {/* Title */}
      <div className="flex flex-col gap-2 lg:gap-4">
        <p className="text-[7px] lg:text-[10px] font-black uppercase tracking-[0.4em] text-gray-300 flex items-center gap-2">
          <Share2 className="h-3 w-3 lg:h-4 lg:w-4" />
          Bagikan Berita
        </p>
        <p className="text-sm lg:text-base text-gray-600">
          Bagikan berita ini ke platform favorit Anda
        </p>
      </div>

      {/* Share Buttons - Grid */}
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4">
        {shareButtons.map((btn) => (
          <button
            key={btn.id}
            onClick={btn.onClick}
            className={`flex flex-col items-center justify-center gap-2 p-3 lg:p-4 rounded-[20px] lg:rounded-[30px] ${btn.color} text-white transition-all hover:shadow-lg active:scale-95 group`}
            title={`Bagikan ke ${btn.name}`}
            aria-label={`Bagikan ke ${btn.name}`}
          >
            <btn.icon className="h-5 w-5 lg:h-6 lg:w-6" />
            <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest hidden sm:block">{btn.name}</span>
          </button>
        ))}

        {/* Copy Link Button */}
        <button
          onClick={handleCopy}
          className={`flex flex-col items-center justify-center gap-2 p-3 lg:p-4 rounded-[20px] lg:rounded-[30px] transition-all hover:shadow-lg active:scale-95 ${
            copied 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-300 hover:bg-gray-400 text-[#0A0F1E]'
          }`}
          title="Salin Link"
          aria-label="Salin Link"
        >
          {copied ? (
            <Check className="h-5 w-5 lg:h-6 lg:w-6" />
          ) : (
            <Copy className="h-5 w-5 lg:h-6 lg:w-6" />
          )}
          <span className="text-[7px] lg:text-[8px] font-black uppercase tracking-widest hidden sm:block">
            {copied ? 'Disalin' : 'Salin'}
          </span>
        </button>
      </div>

      {/* Native Share Button (jika tersedia) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <button
          onClick={() => shareViaWeb(shareOptions)}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 text-[#0A0F1E] px-6 py-3 rounded-[20px] text-[9px] lg:text-[11px] font-black uppercase tracking-[0.3em] hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Share2 className="h-4 w-4" />
          Bagikan Lewat Aplikasi Lain
        </button>
      )}
    </div>
  );
};

export default NewsShareButtons;
