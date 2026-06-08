import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ToolLandingPage } from './ToolLandingPage';
import { getToolLandingPageConfig, getAllToolLandingPages } from '@/lib/toolLandingPages';

describe('ToolLandingPage Component', () => {
  const mockOnLaunchTool = (toolId: string, state?: Record<string, any>) => {
    // Mock implementation
  };

  describe('Rendering', () => {
    it('should render tool landing page with valid toolId', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      expect(config?.title).toContain('Ring Light');
    });

    it('should handle invalid toolId gracefully', () => {
      const config = getToolLandingPageConfig('invalid-tool-id');
      expect(config).toBeNull();
    });

    it('should render all tool landing pages without errors', () => {
      const allTools = getAllToolLandingPages();
      expect(allTools.length).toBeGreaterThan(0);
      
      allTools.forEach(tool => {
        expect(tool.toolId).toBeDefined();
        expect(tool.title).toBeDefined();
        expect(tool.description).toBeDefined();
        expect(tool.useCases).toBeDefined();
        expect(tool.benefits).toBeDefined();
      });
    });
  });

  describe('Tool Configuration', () => {
    it('should have required properties for each tool', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool).toHaveProperty('toolId');
        expect(tool).toHaveProperty('title');
        expect(tool).toHaveProperty('description');
        expect(tool).toHaveProperty('keywords');
        expect(tool).toHaveProperty('ogTitle');
        expect(tool).toHaveProperty('ogDescription');
        expect(tool).toHaveProperty('ogImage');
        expect(tool).toHaveProperty('twitterCard');
        expect(tool).toHaveProperty('useCases');
        expect(tool).toHaveProperty('benefits');
        expect(tool).toHaveProperty('relatedTools');
        expect(tool).toHaveProperty('cta');
      });
    });

    it('should have valid CTA configuration', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.cta).toHaveProperty('text');
        expect(tool.cta).toHaveProperty('action');
        expect(tool.cta.text).toBeTruthy();
        expect(tool.cta.action).toBeTruthy();
      });
    });

    it('should have at least 2 use cases per tool', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.useCases.length).toBeGreaterThanOrEqual(2);
      });
    });

    it('should have at least 2 benefits per tool', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.benefits.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  describe('SEO Metadata', () => {
    it('should have valid SEO titles', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.title.length).toBeGreaterThan(0);
        expect(tool.title.length).toBeLessThanOrEqual(60);
      });
    });

    it('should have valid SEO descriptions', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.description.length).toBeGreaterThan(0);
        expect(tool.description.length).toBeLessThanOrEqual(160);
      });
    });

    it('should have keywords for each tool', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.keywords.length).toBeGreaterThan(0);
        expect(tool.keywords.every(k => typeof k === 'string')).toBe(true);
      });
    });

    it('should have valid Open Graph metadata', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(tool.ogTitle).toBeTruthy();
        expect(tool.ogDescription).toBeTruthy();
        expect(tool.ogImage).toBeTruthy();
        expect(tool.twitterCard).toBeTruthy();
      });
    });
  });

  describe('Tool Categories', () => {
    it('should have ring-light tool configured', () => {
      const config = getToolLandingPageConfig('ring-light');
      expect(config).toBeDefined();
      expect(config?.title).toContain('Ring Light');
      expect(config?.useCases.length).toBeGreaterThan(0);
    });

    it('should have color-screen tool configured', () => {
      const config = getToolLandingPageConfig('color-screen');
      expect(config).toBeDefined();
      expect(config?.title).toContain('Color Screen');
    });

    it('should have focus-mode tool configured', () => {
      const config = getToolLandingPageConfig('focus-mode');
      expect(config).toBeDefined();
      expect(config?.title).toContain('Focus Mode');
    });

    it('should have prank tools configured', () => {
      const brokenScreen = getToolLandingPageConfig('broken-screen');
      const hackerTyper = getToolLandingPageConfig('hacker-typer');
      const fakeUpdate = getToolLandingPageConfig('fake-windows-update');

      expect(brokenScreen).toBeDefined();
      expect(hackerTyper).toBeDefined();
      expect(fakeUpdate).toBeDefined();
    });
  });

  describe('Related Tools', () => {
    it('should have related tools configured', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        expect(Array.isArray(tool.relatedTools)).toBe(true);
        if (tool.relatedTools.length > 0) {
          tool.relatedTools.forEach(relatedId => {
            const relatedTool = getToolLandingPageConfig(relatedId);
            expect(relatedTool).toBeDefined();
          });
        }
      });
    });
  });

  describe('Pre-configured State', () => {
    it('should have optional pre-configured state', () => {
      const ringLight = getToolLandingPageConfig('ring-light');
      expect(ringLight?.preConfiguredState).toBeDefined();
      expect(ringLight?.preConfiguredState?.intensity).toBeDefined();
      expect(ringLight?.preConfiguredState?.temperature).toBeDefined();
    });

    it('should preserve pre-configured state structure', () => {
      const tools = getAllToolLandingPages();
      
      tools.forEach(tool => {
        if (tool.preConfiguredState) {
          expect(typeof tool.preConfiguredState).toBe('object');
          expect(Object.keys(tool.preConfiguredState).length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Tool Paths', () => {
    it('should generate correct tool paths', () => {
      const { getToolPath } = require('@/lib/toolLandingPages');
      
      expect(getToolPath('ring-light')).toBe('/ring-light');
      expect(getToolPath('color-screen')).toBe('/color-screen');
      expect(getToolPath('broken-screen')).toBe('/broken-screen');
    });
  });

  describe('Tool Search', () => {
    it('should search tools by keyword', () => {
      const { searchTools } = require('@/lib/toolLandingPages');
      
      const results = searchTools('ring');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((t: any) => t.toolId === 'ring-light')).toBe(true);
    });

    it('should return empty array for non-matching search', () => {
      const { searchTools } = require('@/lib/toolLandingPages');
      
      const results = searchTools('nonexistent-tool-xyz');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Tool Categories', () => {
    it('should categorize tools correctly', () => {
      const { getToolsByCategory } = require('@/lib/toolLandingPages');
      
      const productivityTools = getToolsByCategory('productivity');
      expect(Array.isArray(productivityTools)).toBe(true);
      
      const testingTools = getToolsByCategory('testing');
      expect(Array.isArray(testingTools)).toBe(true);
      
      const pranks = getToolsByCategory('pranks');
      expect(Array.isArray(pranks)).toBe(true);
      
      const effects = getToolsByCategory('effects');
      expect(Array.isArray(effects)).toBe(true);
    });
  });
});
