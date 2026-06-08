/**
 * Core Web Vitals Monitoring
 * Tracks LCP (Largest Contentful Paint), CLS (Cumulative Layout Shift), and INP (Interaction to Next Paint)
 */

export interface WebVitalsMetrics {
  lcp?: number; // Largest Contentful Paint (milliseconds)
  cls?: number; // Cumulative Layout Shift (unitless)
  inp?: number; // Interaction to Next Paint (milliseconds)
  fcp?: number; // First Contentful Paint (milliseconds)
  ttfb?: number; // Time to First Byte (milliseconds)
}

export interface VitalsThresholds {
  lcp: { good: number; needsImprovement: number }; // Good: ≤2.5s, Needs improvement: ≤4s
  cls: { good: number; needsImprovement: number }; // Good: ≤0.1, Needs improvement: ≤0.25
  inp: { good: number; needsImprovement: number }; // Good: ≤200ms, Needs improvement: ≤500ms
}

export const VITALS_THRESHOLDS: VitalsThresholds = {
  lcp: { good: 2500, needsImprovement: 4000 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  inp: { good: 200, needsImprovement: 500 },
};

/**
 * Measure Core Web Vitals using Web Vitals API
 */
export function measureWebVitals(callback: (metrics: WebVitalsMetrics) => void): void {
  const metrics: WebVitalsMetrics = {};

  // Measure LCP (Largest Contentful Paint)
  if ('PerformanceObserver' in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        callback(metrics);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP measurement not supported', e);
    }

    // Measure CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            metrics.cls = clsValue;
            callback(metrics);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS measurement not supported', e);
    }

    // Measure INP (Interaction to Next Paint)
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        metrics.inp = (lastEntry as any).processingDuration;
        callback(metrics);
      });
      inpObserver.observe({ entryTypes: ['event'] });
    } catch (e) {
      console.warn('INP measurement not supported', e);
    }

    // Measure FCP (First Contentful Paint)
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          metrics.fcp = fcpEntry.startTime;
          callback(metrics);
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP measurement not supported', e);
    }
  }

  // Measure TTFB (Time to First Byte)
  if ('performance' in window && 'getEntriesByType' in performance) {
    try {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationTiming) {
        metrics.ttfb = navigationTiming.responseStart - navigationTiming.fetchStart;
        callback(metrics);
      }
    } catch (e) {
      console.warn('TTFB measurement not supported', e);
    }
  }
}

/**
 * Assess metric status based on thresholds
 */
export function assessMetricStatus(
  metric: 'lcp' | 'cls' | 'inp',
  value: number
): 'good' | 'needs-improvement' | 'poor' {
  const threshold = VITALS_THRESHOLDS[metric];
  if (value <= threshold.good) {
    return 'good';
  }
  if (value <= threshold.needsImprovement) {
    return 'needs-improvement';
  }
  return 'poor';
}

/**
 * Report metrics to analytics service
 */
export function reportWebVitals(metrics: WebVitalsMetrics): void {
  // This would typically send metrics to an analytics service
  // For now, we log to console and localStorage
  console.log('Web Vitals:', metrics);

  try {
    localStorage.setItem('web-vitals', JSON.stringify(metrics));
  } catch (e) {
    console.warn('Failed to store Web Vitals', e);
  }
}

/**
 * Get stored Web Vitals from localStorage
 */
export function getStoredWebVitals(): WebVitalsMetrics | null {
  try {
    const stored = localStorage.getItem('web-vitals');
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.warn('Failed to retrieve stored Web Vitals', e);
    return null;
  }
}

/**
 * Optimize performance by lazy loading non-critical resources
 */
export function lazyLoadResources(): void {
  // Lazy load images
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src || '';
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach((img) => imageObserver.observe(img));
  }
}

/**
 * Optimize CSS and JavaScript delivery
 */
export function optimizeAssetDelivery(): void {
  // Preload critical resources
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  document.head.appendChild(link);

  // Defer non-critical scripts
  const scripts = document.querySelectorAll('script[data-defer]');
  scripts.forEach((script) => {
    script.removeAttribute('data-defer');
    (script as HTMLScriptElement).defer = true;
  });
}

/**
 * Monitor and log performance metrics
 */
export function initPerformanceMonitoring(): void {
  measureWebVitals((metrics) => {
    reportWebVitals(metrics);

    // Log status
    if (metrics.lcp) {
      const lcpStatus = assessMetricStatus('lcp', metrics.lcp);
      console.log(`LCP: ${metrics.lcp.toFixed(0)}ms (${lcpStatus})`);
    }
    if (metrics.cls !== undefined) {
      const clsStatus = assessMetricStatus('cls', metrics.cls);
      console.log(`CLS: ${metrics.cls.toFixed(3)} (${clsStatus})`);
    }
    if (metrics.inp) {
      const inpStatus = assessMetricStatus('inp', metrics.inp);
      console.log(`INP: ${metrics.inp.toFixed(0)}ms (${inpStatus})`);
    }
  });

  lazyLoadResources();
  optimizeAssetDelivery();
}
