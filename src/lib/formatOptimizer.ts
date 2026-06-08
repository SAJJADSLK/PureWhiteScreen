/**
 * Web Format Optimizer
 * Handles image format conversion and optimization
 */

export interface FormatConversionOptions {
  quality?: number; // 0-100
  width?: number;
  height?: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
}

export interface FormatComparison {
  original: {
    format: string;
    size: number;
    url: string;
  };
  webp?: {
    format: string;
    size: number;
    url: string;
    savings: number; // percentage
  };
  avif?: {
    format: string;
    size: number;
    url: string;
    savings: number; // percentage
  };
  recommended: 'webp' | 'avif' | 'original';
}

export interface BrowserSupport {
  webp: boolean;
  avif: boolean;
  heic: boolean;
}

/**
 * Check browser support for modern image formats
 */
export async function checkBrowserSupport(): Promise<BrowserSupport> {
  const support: BrowserSupport = {
    webp: false,
    avif: false,
    heic: false,
  };

  // Check WebP support
  const webpCanvas = document.createElement('canvas');
  if (webpCanvas.toDataURL('image/webp').indexOf('image/webp') === 0) {
    support.webp = true;
  }

  // Check AVIF support (more complex)
  try {
    const avifImage = new Image();
    await new Promise((resolve) => {
      avifImage.onload = () => {
        support.avif = true;
        resolve(true);
      };
      avifImage.onerror = () => {
        resolve(false);
      };
      // 1x1 AVIF image
      avifImage.src =
        'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1ldGEAAAA0aGRscgAAAAAAAAAAYXZpZm1haW4AAAA';
    });
  } catch {
    support.avif = false;
  }

  return support;
}

/**
 * Estimate file size savings for different formats
 */
export function estimateSavings(
  originalSize: number,
  format: 'webp' | 'avif'
): number {
  // Typical compression ratios
  const ratios = {
    webp: 0.7, // ~30% smaller than JPEG
    avif: 0.5, // ~50% smaller than JPEG
  };

  const ratio = ratios[format];
  const estimatedSize = originalSize * ratio;
  const savings = ((originalSize - estimatedSize) / originalSize) * 100;

  return Math.round(savings);
}

/**
 * Get recommended format based on browser support and file size
 */
export async function getRecommendedFormat(
  originalSize: number
): Promise<'webp' | 'avif' | 'original'> {
  const support = await checkBrowserSupport();

  if (support.avif && originalSize > 100000) {
    return 'avif'; // AVIF for large files
  }

  if (support.webp) {
    return 'webp'; // WebP as fallback
  }

  return 'original'; // Keep original if no support
}

/**
 * Create a format comparison
 */
export async function createFormatComparison(
  originalSize: number,
  originalFormat: string
): Promise<FormatComparison> {
  const support = await checkBrowserSupport();
  const comparison: FormatComparison = {
    original: {
      format: originalFormat,
      size: originalSize,
      url: '',
    },
    recommended: 'original',
  };

  if (support.webp) {
    const webpSavings = estimateSavings(originalSize, 'webp');
    comparison.webp = {
      format: 'WebP',
      size: Math.round(originalSize * (1 - webpSavings / 100)),
      url: '',
      savings: webpSavings,
    };
  }

  if (support.avif) {
    const avifSavings = estimateSavings(originalSize, 'avif');
    comparison.avif = {
      format: 'AVIF',
      size: Math.round(originalSize * (1 - avifSavings / 100)),
      url: '',
      savings: avifSavings,
    };
  }

  // Determine recommended format
  if (comparison.avif && comparison.webp) {
    comparison.recommended = comparison.avif.savings > comparison.webp.savings ? 'avif' : 'webp';
  } else if (comparison.avif) {
    comparison.recommended = 'avif';
  } else if (comparison.webp) {
    comparison.recommended = 'webp';
  }

  return comparison;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Calculate compression ratio
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * Get quality recommendation based on format
 */
export function getQualityRecommendation(format: 'webp' | 'avif' | 'jpeg'): number {
  const recommendations = {
    webp: 80, // WebP can use lower quality
    avif: 75, // AVIF can use even lower quality
    jpeg: 85, // JPEG needs higher quality
  };

  return recommendations[format];
}

/**
 * Validate image format
 */
export function isValidImageFormat(
  format: string
): format is 'webp' | 'avif' | 'jpeg' | 'png' {
  return ['webp', 'avif', 'jpeg', 'png'].includes(format.toLowerCase());
}

/**
 * Get MIME type for format
 */
export function getMimeType(
  format: 'webp' | 'avif' | 'jpeg' | 'png'
): string {
  const mimeTypes = {
    webp: 'image/webp',
    avif: 'image/avif',
    jpeg: 'image/jpeg',
    png: 'image/png',
  };

  return mimeTypes[format];
}

/**
 * Calculate estimated bandwidth savings
 */
export function calculateBandwidthSavings(
  originalSize: number,
  compressedSize: number,
  pageViews: number = 10000
): {
  perVisit: string;
  monthly: string;
  yearly: string;
} {
  const savingsPerVisit = originalSize - compressedSize;
  const monthlySavings = savingsPerVisit * pageViews * 30;
  const yearlySavings = savingsPerVisit * pageViews * 365;

  return {
    perVisit: formatFileSize(savingsPerVisit),
    monthly: formatFileSize(monthlySavings),
    yearly: formatFileSize(yearlySavings),
  };
}

/**
 * Format quality percentage
 */
export function formatQuality(quality: number): string {
  return `${Math.round(quality)}%`;
}

/**
 * Get format icon/emoji
 */
export function getFormatIcon(format: string): string {
  const icons: Record<string, string> = {
    webp: '🖼️',
    avif: '📸',
    jpeg: '🎨',
    png: '🎭',
    original: '📁',
  };

  return icons[format.toLowerCase()] || '📄';
}
