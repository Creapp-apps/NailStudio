import { WebCustomizationConfig } from '../types/webConfig';

/**
 * Synchronizes the browser document title, favicon, and brand metadata
 * in real time with the atelier's custom identity configuration.
 */
export function syncDocumentBrand(config: Partial<WebCustomizationConfig>) {
  if (typeof document === 'undefined') return;

  const brandName = config.brandName?.trim() || 'Atelier Nails & Co.';
  const brandTagline = config.brandTagline?.trim() || 'Haute Studio & Suite';

  // 1. Update Browser Tab Title
  document.title = `${brandName} | ${brandTagline}`;

  // 2. Find or create <link rel="icon">
  let faviconLink = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  if (!faviconLink) {
    faviconLink = document.createElement('link');
    faviconLink.rel = 'icon';
    document.head.appendChild(faviconLink);
  }

  // 3. Find or create <link rel="apple-touch-icon">
  let appleTouchIcon = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement | null;
  if (!appleTouchIcon) {
    appleTouchIcon = document.createElement('link');
    appleTouchIcon.rel = 'apple-touch-icon';
    document.head.appendChild(appleTouchIcon);
  }

  // 4. Update Favicon according to custom logo or emoji
  if (config.customLogoUrl && config.customLogoUrl.trim()) {
    const isSvg = config.customLogoUrl.startsWith('data:image/svg') || config.customLogoUrl.endsWith('.svg');
    faviconLink.type = isSvg ? 'image/svg+xml' : 'image/png';
    faviconLink.href = config.customLogoUrl;
    appleTouchIcon.href = config.customLogoUrl;
  } else {
    faviconLink.type = 'image/svg+xml';
    const emoji = config.logoEmoji?.trim() || '💅';
    const svgData = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>${emoji}</text></svg>`;
    faviconLink.href = svgData;
    appleTouchIcon.href = svgData;
  }
}
