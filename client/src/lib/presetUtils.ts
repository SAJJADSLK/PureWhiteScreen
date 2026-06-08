/**
 * Preset utilities for sharing and loading presets from URLs
 */

/**
 * Extract share token from URL query parameters
 */
export function getShareTokenFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('preset');
}

/**
 * Generate shareable URL with preset token
 */
export function generateShareUrl(shareToken: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}?preset=${shareToken}`;
}

/**
 * Copy share URL to clipboard
 */
export async function copyShareUrlToClipboard(shareToken: string): Promise<boolean> {
  try {
    const url = generateShareUrl(shareToken);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('Failed to copy share URL:', error);
    return false;
  }
}

/**
 * Check if current page has a shared preset in URL
 */
export function hasSharedPreset(): boolean {
  return getShareTokenFromUrl() !== null;
}
