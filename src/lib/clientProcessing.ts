/**
 * Client-Side Processing
 * Handles image processing without server: compression, resizing, format conversion
 */

export interface ProcessingOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  offline?: boolean;
}

export interface ProcessingResult {
  success: boolean;
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  processingTime: number;
  blob?: Blob;
  error?: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

/**
 * Check if WebAssembly is supported
 */
export function isWebAssemblySupported(): boolean {
  return typeof WebAssembly !== 'undefined';
}

/**
 * Check if offline processing is available
 */
export function isOfflineProcessingAvailable(): boolean {
  return (
    typeof Blob !== 'undefined' &&
    typeof HTMLCanvasElement !== 'undefined' &&
    typeof ImageData !== 'undefined'
  );
}

/**
 * Compress image client-side
 */
export async function compressImage(
  file: File,
  options: ProcessingOptions = {}
): Promise<ProcessingResult> {
  const startTime = Date.now();
  const originalSize = file.size;

  try {
    // Read file as data URL
    const dataUrl = await readFileAsDataURL(file);

    // Create image
    const image = new Image();
    image.src = dataUrl;

    // Wait for image to load
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    // Get dimensions
    const dimensions = getImageDimensions(image);

    // Calculate new dimensions
    const newDimensions = calculateNewDimensions(
      dimensions,
      options.maxWidth,
      options.maxHeight
    );

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = newDimensions.width;
    canvas.height = newDimensions.height;

    // Draw image
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(image, 0, 0, newDimensions.width, newDimensions.height);

    // Convert to blob
    const format = options.format || 'webp';
    const quality = options.quality || 0.8;
    const blob = await canvasToBlob(canvas, format, quality);

    const processingTime = Date.now() - startTime;
    const processedSize = blob.size;
    const compressionRatio = Math.round((1 - processedSize / originalSize) * 100);

    return {
      success: true,
      originalSize,
      processedSize,
      compressionRatio,
      processingTime,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      originalSize,
      processedSize: 0,
      compressionRatio: 0,
      processingTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Compression failed',
    };
  }
}

/**
 * Resize image client-side
 */
export async function resizeImage(
  file: File,
  width: number,
  height: number,
  format: 'jpeg' | 'png' | 'webp' = 'webp'
): Promise<ProcessingResult> {
  const startTime = Date.now();
  const originalSize = file.size;

  try {
    const dataUrl = await readFileAsDataURL(file);
    const image = new Image();
    image.src = dataUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(image, 0, 0, width, height);

    const blob = await canvasToBlob(canvas, format, 0.9);

    return {
      success: true,
      originalSize,
      processedSize: blob.size,
      compressionRatio: Math.round((1 - blob.size / originalSize) * 100),
      processingTime: Date.now() - startTime,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      originalSize,
      processedSize: 0,
      compressionRatio: 0,
      processingTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Resize failed',
    };
  }
}

/**
 * Convert image format client-side
 */
export async function convertFormat(
  file: File,
  targetFormat: 'jpeg' | 'png' | 'webp' | 'avif',
  quality: number = 0.9
): Promise<ProcessingResult> {
  const startTime = Date.now();
  const originalSize = file.size;

  try {
    const dataUrl = await readFileAsDataURL(file);
    const image = new Image();
    image.src = dataUrl;

    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
    });

    const canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    ctx.drawImage(image, 0, 0);

    const blob = await canvasToBlob(canvas, targetFormat, quality);

    return {
      success: true,
      originalSize,
      processedSize: blob.size,
      compressionRatio: Math.round((1 - blob.size / originalSize) * 100),
      processingTime: Date.now() - startTime,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      originalSize,
      processedSize: 0,
      compressionRatio: 0,
      processingTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Format conversion failed',
    };
  }
}

/**
 * Batch process images client-side
 */
export async function batchProcessImages(
  files: File[],
  options: ProcessingOptions = {}
): Promise<ProcessingResult[]> {
  const results: ProcessingResult[] = [];

  for (const file of files) {
    const result = await compressImage(file, options);
    results.push(result);
  }

  return results;
}

/**
 * Read file as data URL
 */
function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Get image dimensions
 */
function getImageDimensions(image: HTMLImageElement): ImageDimensions {
  return {
    width: image.width,
    height: image.height,
    aspectRatio: image.width / image.height,
  };
}

/**
 * Calculate new dimensions maintaining aspect ratio
 */
function calculateNewDimensions(
  current: ImageDimensions,
  maxWidth?: number,
  maxHeight?: number
): ImageDimensions {
  let { width, height } = current;

  if (maxWidth && width > maxWidth) {
    width = maxWidth;
    height = Math.round(width / current.aspectRatio);
  }

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = Math.round(height * current.aspectRatio);
  }

  return {
    width,
    height,
    aspectRatio: width / height,
  };
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      },
      `image/${format}`,
      quality
    );
  });
}

/**
 * Estimate compression ratio
 */
export function estimateCompressionRatio(
  format: string,
  currentFormat: string
): number {
  const ratios: Record<string, Record<string, number>> = {
    webp: { jpeg: 0.7, png: 0.6, avif: 0.8 },
    avif: { jpeg: 0.5, png: 0.4, webp: 0.6 },
    jpeg: { png: 0.8, webp: 1.2, avif: 1.5 },
    png: { jpeg: 1.2, webp: 1.5, avif: 1.8 },
  };

  const ratio = ratios[format]?.[currentFormat] || 0.8;
  return Math.round((1 - ratio) * 100);
}

/**
 * Get supported formats
 */
export function getSupportedFormats(): string[] {
  const formats = ['jpeg', 'png'];

  // Check WebP support
  const canvas = document.createElement('canvas');
  if (canvas.toDataURL('image/webp').indexOf('image/webp') === 0) {
    formats.push('webp');
  }

  return formats;
}

/**
 * Check if format is supported
 */
export function isFormatSupported(format: string): boolean {
  return getSupportedFormats().includes(format.toLowerCase());
}

/**
 * Calculate processing time estimate
 */
export function estimateProcessingTime(
  fileSize: number,
  operation: 'compress' | 'resize' | 'convert'
): number {
  const baseTimes: Record<string, number> = {
    compress: 500,
    resize: 300,
    convert: 400,
  };

  const baseTime = baseTimes[operation] || 500;
  const sizeMultiplier = Math.log(fileSize / 1000000);

  return Math.max(100, baseTime + sizeMultiplier * 200);
}

/**
 * Get processing progress
 */
export function getProcessingProgress(
  startTime: number,
  estimatedTime: number
): number {
  const elapsed = Date.now() - startTime;
  const progress = Math.min(95, Math.round((elapsed / estimatedTime) * 100));
  return progress;
}

/**
 * Format processing time
 */
export function formatProcessingTime(ms: number): string {
  if (ms < 1000) {
    return `${Math.round(ms)}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Check if offline mode is available
 */
export function isOfflineMode(): boolean {
  return !navigator.onLine;
}

/**
 * Store processing result locally
 */
export async function storeProcessingResultLocally(
  key: string,
  result: ProcessingResult
): Promise<void> {
  if (!result.blob) return;

  try {
    const db = await openIndexedDB();
    const tx = db.transaction('processingResults', 'readwrite');
    const store = tx.objectStore('processingResults');

    await store.put({
      key,
      result,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error('Failed to store result locally:', error);
  }
}

/**
 * Retrieve processing result from local storage
 */
export async function retrieveProcessingResultLocally(
  key: string
): Promise<ProcessingResult | null> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('processingResults', 'readonly');
    const store = tx.objectStore('processingResults');

    return new Promise((resolve) => {
      const request = store.get(key);
      request.onsuccess = () => {
        resolve(request.result?.result || null);
      };
      request.onerror = () => {
        resolve(null);
      };
    });
  } catch (error) {
    console.error('Failed to retrieve result locally:', error);
    return null;
  }
}

/**
 * Open IndexedDB
 */
function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('purewhitescreen', 1);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('processingResults')) {
        db.createObjectStore('processingResults', { keyPath: 'key' });
      }
    };
  });
}

/**
 * Clear local processing cache
 */
export async function clearLocalProcessingCache(): Promise<void> {
  try {
    const db = await openIndexedDB();
    const tx = db.transaction('processingResults', 'readwrite');
    const store = tx.objectStore('processingResults');
    store.clear();
  } catch (error) {
    console.error('Failed to clear cache:', error);
  }
}
