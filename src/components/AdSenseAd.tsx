import { useEffect } from 'react';

interface AdSenseAdProps {
  slot: string;
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  responsive?: boolean;
  className?: string;
}

/**
 * AdSense Ad Component
 * Displays Google AdSense ads with proper formatting and responsive behavior
 */
export function AdSenseAd({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}: AdSenseAdProps) {
  useEffect(() => {
    // Push ad to Google AdSense
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, [slot]);

  return (
    <div className={`adsense-ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          minHeight: '250px',
        }}
        data-ad-client="ca-pub-3811332485680799"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}

/**
 * Banner Ad Component (728x90 or responsive)
 */
export function BannerAd({ className = '' }: { className?: string }) {
  return (
    <AdSenseAd
      slot="1234567890"
      format="horizontal"
      responsive={true}
      className={className}
    />
  );
}

/**
 * Sidebar Ad Component (300x250)
 */
export function SidebarAd({ className = '' }: { className?: string }) {
  return (
    <AdSenseAd
      slot="0987654321"
      format="rectangle"
      responsive={true}
      className={className}
    />
  );
}

/**
 * Vertical Ad Component (120x600 or 160x600)
 */
export function VerticalAd({ className = '' }: { className?: string }) {
  return (
    <AdSenseAd
      slot="5555555555"
      format="vertical"
      responsive={true}
      className={className}
    />
  );
}
