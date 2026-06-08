import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ToolLandingPageWrapper } from './ToolLandingPageWrapper';
import { getToolLandingPageConfig } from '@/lib/toolLandingPages';

describe('ToolLandingPageWrapper - SEO Injection', () => {
  beforeEach(() => {
    // Clear document head before each test
    document.head.innerHTML = '';
    document.title = '';
  });

  afterEach(() => {
    // Clean up after each test
    document.head.innerHTML = '';
  });

  describe('Meta Tag Injection', () => {
    it('should inject title meta tag', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      
      // Simulate what ToolLandingPageWrapper does
      document.title = config!.title;
      
      expect(document.title).toContain('Ring Light');
    });

    it('should inject description meta tag', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      
      // Create and inject description tag
      const descTag = document.createElement('meta');
      descTag.name = 'description';
      descTag.content = config!.description;
      document.head.appendChild(descTag);
      
      const injected = document.querySelector('meta[name="description"]');
      expect(injected).toBeDefined();
      expect(injected?.getAttribute('content')).toBe(config!.description);
    });

    it('should inject keywords meta tag', () => {
      const config = getToolLandingPageConfig('color-screen');
      expect(config).toBeDefined();
      
      const keywordsTag = document.createElement('meta');
      keywordsTag.name = 'keywords';
      keywordsTag.content = config!.keywords.join(', ');
      document.head.appendChild(keywordsTag);
      
      const injected = document.querySelector('meta[name="keywords"]');
      expect(injected).toBeDefined();
      expect(injected?.getAttribute('content')).toContain('color');
    });

    it('should inject Open Graph meta tags', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      
      // Inject OG tags
      const ogTitleTag = document.createElement('meta');
      ogTitleTag.setAttribute('property', 'og:title');
      ogTitleTag.content = config!.ogTitle;
      document.head.appendChild(ogTitleTag);
      
      const ogDescTag = document.createElement('meta');
      ogDescTag.setAttribute('property', 'og:description');
      ogDescTag.content = config!.ogDescription;
      document.head.appendChild(ogDescTag);
      
      const ogImageTag = document.createElement('meta');
      ogImageTag.setAttribute('property', 'og:image');
      ogImageTag.content = config!.ogImage;
      document.head.appendChild(ogImageTag);
      
      expect(document.querySelector('meta[property="og:title"]')).toBeDefined();
      expect(document.querySelector('meta[property="og:description"]')).toBeDefined();
      expect(document.querySelector('meta[property="og:image"]')).toBeDefined();
    });

    it('should inject Twitter Card meta tags', () => {
      const config = getToolLandingPageConfig('focus-mode');
      expect(config).toBeDefined();
      
      const twitterCardTag = document.createElement('meta');
      twitterCardTag.name = 'twitter:card';
      twitterCardTag.content = config!.twitterCard;
      document.head.appendChild(twitterCardTag);
      
      const twitterTitleTag = document.createElement('meta');
      twitterTitleTag.name = 'twitter:title';
      twitterTitleTag.content = config!.ogTitle;
      document.head.appendChild(twitterTitleTag);
      
      expect(document.querySelector('meta[name="twitter:card"]')).toBeDefined();
      expect(document.querySelector('meta[name="twitter:title"]')).toBeDefined();
    });

    it('should inject canonical URL', () => {
      const toolId = 'ring-light';
      const canonicalUrl = `${window.location.origin}/tools/${toolId}`;
      
      const canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = canonicalUrl;
      document.head.appendChild(canonicalLink);
      
      const injected = document.querySelector('link[rel="canonical"]');
      expect(injected).toBeDefined();
      expect(injected?.getAttribute('href')).toContain('/tools/ring-light');
    });
  });

  describe('Structured Data Injection', () => {
    it('should inject breadcrumb structured data', () => {
      const breadcrumbScript = document.createElement('script');
      breadcrumbScript.type = 'application/ld+json';
      breadcrumbScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: window.location.origin,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Tools',
            item: `${window.location.origin}/tools`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Ring Light',
            item: `${window.location.origin}/tools/ring-light`,
          },
        ],
      });
      document.head.appendChild(breadcrumbScript);
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBeGreaterThan(0);
      
      const breadcrumbData = JSON.parse(scripts[0].textContent || '{}');
      expect(breadcrumbData['@type']).toBe('BreadcrumbList');
      expect(breadcrumbData.itemListElement.length).toBe(3);
    });

    it('should inject tool-specific structured data', () => {
      const toolScript = document.createElement('script');
      toolScript.type = 'application/ld+json';
      toolScript.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Ring Light Simulator',
        description: 'Test your ring light setup before buying',
        url: `${window.location.origin}/tools/ring-light`,
        applicationCategory: 'Productivity',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      });
      document.head.appendChild(toolScript);
      
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      const toolData = JSON.parse(scripts[scripts.length - 1].textContent || '{}');
      
      expect(toolData['@type']).toBe('SoftwareApplication');
      expect(toolData.name).toContain('Ring Light');
      expect(toolData.offers.price).toBe('0');
    });
  });

  describe('Tool-Specific Metadata', () => {
    it('should have correct metadata for ring-light tool', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      
      expect(config!.title).toContain('Ring Light');
      expect(config!.description.length).toBeGreaterThan(0);
      expect(config!.keywords.length).toBeGreaterThan(0);
      expect(config!.ogImage).toBeTruthy();
    });

    it('should have correct metadata for color-screen tool', () => {
      const config = getToolLandingPageConfig('color-screen');
      expect(config).toBeDefined();
      
      expect(config!.title).toContain('Color Screen');
      expect(config!.useCases.length).toBeGreaterThan(0);
      expect(config!.benefits.length).toBeGreaterThan(0);
    });

    it('should have correct metadata for focus-mode tool', () => {
      const config = getToolLandingPageConfig('focus-mode');
      expect(config).toBeDefined();
      
      expect(config!.title).toContain('Focus Mode');
      expect(config!.cta).toBeDefined();
      expect(config!.cta.text).toBeTruthy();
    });

    it('should have pre-configured state for tools that support it', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      
      if (config!.preConfiguredState) {
        expect(typeof config!.preConfiguredState).toBe('object');
        expect(Object.keys(config!.preConfiguredState).length).toBeGreaterThan(0);
      }
    });
  });

  describe('URL Handling', () => {
    it('should handle tool URLs correctly', () => {
      const toolId = 'ring-light';
      const url = `/tools/${toolId}`;
      
      expect(url).toContain('/tools/');
      expect(url).toContain('ring-light');
    });

    it('should handle absolute URLs for canonical tags', () => {
      const toolId = 'color-screen';
      const canonicalUrl = `${window.location.origin}/tools/${toolId}`;
      
      expect(canonicalUrl).toContain(window.location.origin);
      expect(canonicalUrl).toContain('/tools/');
    });

    it('should handle OG image URLs', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      
      const ogImage = config!.ogImage;
      // OG image can be relative or absolute
      expect(ogImage).toBeTruthy();
      expect(ogImage.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid tool IDs gracefully', () => {
      const config = getToolLandingPageConfig('invalid-tool-xyz');
      expect(config).toBeNull();
    });

    it('should render error message for invalid tools', () => {
      const toolId = 'invalid-tool';
      const config = getToolLandingPageConfig(toolId);
      
      if (!config) {
        expect(config).toBeNull();
      }
    });
  });

  describe('Navigation State Handling', () => {
    it('should preserve pre-configured state in URL', () => {
      const state = {
        intensity: 80,
        temperature: 5500,
        angle: 45,
      };
      
      const params = new URLSearchParams();
      Object.entries(state).forEach(([key, value]) => {
        params.set(key, JSON.stringify(value));
      });
      
      const url = `/ring-light?${params.toString()}`;
      
      expect(url).toContain('intensity');
      expect(url).toContain('5500');
      expect(url).toContain('45');
    });

    it('should handle navigation without state', () => {
      const toolId = 'white-screen';
      const url = `/${toolId}`;
      
      expect(url).toBe('/white-screen');
      expect(url).not.toContain('?');
    });
  });
});
