/**
 * Utility untuk social media sharing
 * Mengisi otomatis title, description, dan URL saat share
 */

export interface ShareOptions {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
}

/**
 * Share ke Facebook
 * Format: https://www.facebook.com/sharer/sharer.php?u=URL&quote=TEXT
 */
export const shareToFacebook = ({ title, description, url = window.location.href }: ShareOptions) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedQuote = encodeURIComponent(`${title} - ${description}`);
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedQuote}`;
  window.open(facebookUrl, 'facebook-share', 'width=600,height=400');
};

/**
 * Share ke WhatsApp
 * Format: https://wa.me/?text=TEXT%20URL
 */
export const shareToWhatsApp = ({ title, description, url = window.location.href }: ShareOptions) => {
  const message = encodeURIComponent(`${title}\n\n${description}\n\n${url}`);
  const whatsappUrl = `https://wa.me/?text=${message}`;
  window.open(whatsappUrl, '_blank');
};

/**
 * Share ke Twitter/X
 * Format: https://x.com/intent/tweet?text=TEXT&url=URL
 */
export const shareToTwitter = ({ title, description, url = window.location.href }: ShareOptions) => {
  const encodedText = encodeURIComponent(`${title} ${description}`);
  const encodedUrl = encodeURIComponent(url);
  const twitterUrl = `https://x.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
  window.open(twitterUrl, 'twitter-share', 'width=600,height=400');
};

/**
 * Share ke LinkedIn
 */
export const shareToLinkedIn = ({ title, description, url = window.location.href }: ShareOptions) => {
  const encodedUrl = encodeURIComponent(url);
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  window.open(linkedinUrl, 'linkedin-share', 'width=600,height=400');
};

/**
 * Share ke Telegram
 */
export const shareToTelegram = ({ title, description, url = window.location.href }: ShareOptions) => {
  const text = encodeURIComponent(`${title}\n${description}`);
  const encodedUrl = encodeURIComponent(url);
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${text}`;
  window.open(telegramUrl, 'telegram-share', 'width=600,height=400');
};

/**
 * Copy link ke clipboard
 */
export const copyToClipboard = async ({ title, description, url = window.location.href }: ShareOptions) => {
  const text = `${title}\n${description}\n${url}`;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Share via native API jika tersedia
 */
export const shareViaWeb = async ({ title, description, url = window.location.href }: ShareOptions) => {
  if (!navigator.share) {
    return false;
  }

  try {
    await navigator.share({
      title,
      text: description,
      url,
    });
    return true;
  } catch (err) {
    console.error('Share failed:', err);
    return false;
  }
};
