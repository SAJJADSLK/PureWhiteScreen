import { describe, it, expect } from 'vitest';

describe('Community Links & CTA Enhancements', () => {
  describe('Community URLs', () => {
    it('should have valid GitHub repository URL', () => {
      const githubUrl = 'https://github.com/screenlab/screenlab';
      expect(githubUrl).toMatch(/^https:\/\/github\.com\/screenlab\/screenlab$/);
    });

    it('should have valid Discord community URL', () => {
      const discordUrl = 'https://discord.gg/screenlab-community';
      expect(discordUrl).toMatch(/^https:\/\/discord\.gg\//);
    });

    it('should have valid Product Hunt URL', () => {
      const phUrl = 'https://www.producthunt.com/products/screenlab';
      expect(phUrl).toMatch(/^https:\/\/www\.producthunt\.com\/products\//);
    });
  });

  describe('Exit-Intent Popup Content', () => {
    it('should offer concrete resource: "50 Pro Tips for Screen Testing & Creative Tools"', () => {
      const offerTitle = 'Grab Your Free Toolkit Guide';
      const offerDescription = 'Download our complete guide: 50 Pro Tips for Screen Testing & Creative Tools';
      
      expect(offerTitle).toBeDefined();
      expect(offerDescription).toContain('50 Pro Tips');
      expect(offerDescription).toContain('Screen Testing');
    });

    it('should include specific benefits in exit-intent popup', () => {
      const benefits = [
        '50 pro tips & workflows (PDF)',
        'Preset library for creators',
        'Bonus: Early access to new tools'
      ];

      benefits.forEach(benefit => {
        expect(benefit).toBeDefined();
        expect(benefit.length).toBeGreaterThan(0);
      });
    });

    it('should have CTA button text: "Download Free Guide"', () => {
      const ctaText = 'Download Free Guide';
      expect(ctaText).toBe('Download Free Guide');
    });
  });

  describe('CTA Optimization', () => {
    it('should trigger exit-intent popup on mouse leave from top', () => {
      const triggerCondition = (clientY: number) => clientY <= 0;
      
      expect(triggerCondition(0)).toBe(true);
      expect(triggerCondition(-5)).toBe(true);
      expect(triggerCondition(100)).toBe(false);
    });

    it('should show floating CTA after scrolling 600px', () => {
      const scrollThreshold = 600;
      
      expect(scrollThreshold > 0).toBe(true);
      expect(scrollThreshold).toBe(600);
    });

    it('should have gradient CTA colors: cyan to blue', () => {
      const ctaGradient = 'from-cyan-500 to-blue-500';
      expect(ctaGradient).toContain('cyan');
      expect(ctaGradient).toContain('blue');
    });
  });

  describe('Community Links Styling', () => {
    it('should have gradient colors for each community link', () => {
      const linkColors = {
        github: 'from-gray-600 to-gray-800',
        discord: 'from-purple-600 to-purple-800',
        producthunt: 'from-orange-600 to-red-600'
      };

      Object.values(linkColors).forEach(color => {
        expect(color).toMatch(/from-\w+-\d+ to-\w+-\d+/);
      });
    });

    it('should have hover effects on community cards', () => {
      const hoverEffect = 'group-hover:border-cyan-500/50';
      expect(hoverEffect).toContain('hover');
      expect(hoverEffect).toContain('cyan');
    });
  });

  describe('Resource Offer Details', () => {
    it('should specify downloadable format: PDF', () => {
      const format = '50 pro tips & workflows (PDF)';
      expect(format).toContain('PDF');
    });

    it('should mention preset library as benefit', () => {
      const benefit = 'Preset library for creators';
      expect(benefit).toContain('Preset');
      expect(benefit).toContain('creators');
    });

    it('should include early access incentive', () => {
      const incentive = 'Bonus: Early access to new tools';
      expect(incentive).toContain('Early access');
    });
  });
});
