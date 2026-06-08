/**
 * Tool-Specific Landing Page Generator
 * Creates dynamic landing pages for each tool with pre-configured states and SEO optimization
 */

export interface ToolLandingPageConfig {
  toolId: string;
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  preConfiguredState?: Record<string, any>;
  useCases: string[];
  benefits: string[];
  relatedTools: string[];
  cta: {
    text: string;
    action: string;
  };
}

/**
 * Tool landing page configurations
 */
const TOOL_LANDING_PAGES: Record<string, ToolLandingPageConfig> = {
  'ring-light': {
    toolId: 'ring-light',
    title: 'Ring Light Simulator - Free Online Ring Light Preview',
    description: 'Test your ring light setup before buying. Adjust intensity, color temperature, and angle to find the perfect lighting for your streams and videos.',
    keywords: ['ring light', 'lighting simulator', 'stream lighting', 'video lighting', 'free ring light tool'],
    ogTitle: 'Ring Light Simulator - Test Your Lighting Setup',
    ogDescription: 'Preview how different ring light settings affect your appearance on camera',
    ogImage: '/og-ring-light.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      intensity: 80,
      temperature: 5500,
      angle: 45,
    },
    useCases: [
      'Test ring light before purchasing',
      'Optimize streaming setup',
      'Preview video lighting',
      'Find perfect color temperature',
    ],
    benefits: [
      'Save money by testing before buying',
      'Get perfect lighting on first try',
      'No equipment needed',
      'Instant preview',
    ],
    relatedTools: ['white-screen', 'color-screen', 'ambient-ocean'],
    cta: {
      text: 'Try Ring Light Simulator',
      action: 'open-tool',
    },
  },
  'white-screen': {
    toolId: 'white-screen',
    title: 'White Screen Test - Free Online Display Test Tool',
    description: 'Test your monitor, TV, or projector with a pure white screen. Detect dead pixels, backlight bleeding, and display issues instantly.',
    keywords: ['white screen', 'dead pixel test', 'monitor test', 'display test', 'pixel checker'],
    ogTitle: 'White Screen Test - Check for Dead Pixels',
    ogDescription: 'Detect dead pixels and display issues with our free white screen test',
    ogImage: '/og-white-screen.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      color: '#FFFFFF',
      brightness: 100,
    },
    useCases: [
      'Test for dead pixels',
      'Check backlight bleeding',
      'Verify display uniformity',
      'Test new monitor',
    ],
    benefits: [
      'Catch display issues early',
      'Completely free',
      'Works on any device',
      'No installation needed',
    ],
    relatedTools: ['color-screen', 'rgb-screen', 'black-screen'],
    cta: {
      text: 'Test Your Display',
      action: 'open-tool',
    },
  },
  'pomodoro': {
    toolId: 'pomodoro',
    title: 'Pomodoro Timer - Free Online Productivity Timer',
    description: 'Boost productivity with the Pomodoro Technique. Customizable timer with break intervals, ambient sounds, and distraction-free mode.',
    keywords: ['pomodoro timer', 'productivity timer', 'focus timer', 'work timer', 'break timer'],
    ogTitle: 'Pomodoro Timer - Increase Your Productivity',
    ogDescription: 'Free online Pomodoro timer with customizable intervals and ambient sounds',
    ogImage: '/og-pomodoro.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      workDuration: 25,
      breakDuration: 5,
      sessionsBeforeLongBreak: 4,
      longBreakDuration: 15,
    },
    useCases: [
      'Increase focus and productivity',
      'Manage work-life balance',
      'Reduce procrastination',
      'Track work sessions',
    ],
    benefits: [
      'Proven productivity method',
      'Customizable intervals',
      'Free and ad-free',
      'Works offline',
    ],
    relatedTools: ['ambient-ocean', 'ambient-rain', 'matrix-rain'],
    cta: {
      text: 'Start Pomodoro Session',
      action: 'open-tool',
    },
  },
  'matrix-rain': {
    toolId: 'matrix-rain',
    title: 'Matrix Rain Effect - Free Animated Matrix Code Screen',
    description: 'Watch the iconic Matrix rain effect with falling green code. Perfect for ambiance, pranks, or just for fun. Fully customizable.',
    keywords: ['matrix rain', 'matrix effect', 'falling code', 'hacker screen', 'matrix animation'],
    ogTitle: 'Matrix Rain - Animated Matrix Code Effect',
    ogDescription: 'Watch the iconic Matrix rain effect with customizable speed and density',
    ogImage: '/og-matrix-rain.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      speed: 50,
      density: 50,
      fontSize: 14,
    },
    useCases: [
      'Ambiance for coding sessions',
      'Prank your friends',
      'Background for streams',
      'Just for fun',
    ],
    benefits: [
      'Mesmerizing animation',
      'Fully customizable',
      'No performance impact',
      'Perfect for pranks',
    ],
    relatedTools: ['broken-screen', 'hacker-typer', 'crt-effect'],
    cta: {
      text: 'Watch Matrix Rain',
      action: 'open-tool',
    },
  },
  'broken-screen': {
    toolId: 'broken-screen',
    title: 'Broken Screen Prank - Fake Cracked Screen Effect',
    description: 'Prank your friends with a realistic broken screen effect. Perfect for April Fools or just for laughs. Includes realistic crack animations.',
    keywords: ['broken screen', 'cracked screen prank', 'fake broken screen', 'screen prank', 'broken glass effect'],
    ogTitle: 'Broken Screen Prank - Realistic Cracked Screen',
    ogDescription: 'Prank your friends with a realistic broken screen effect',
    ogImage: '/og-broken-screen.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      crackDensity: 'medium',
      glassEffect: true,
    },
    useCases: [
      'Prank your friends',
      'April Fools joke',
      'Funny video content',
      'Social media challenge',
    ],
    benefits: [
      'Realistic crack effect',
      'Hilarious reactions',
      'Easy to use',
      'Shareable',
    ],
    relatedTools: ['hacker-typer', 'fake-windows-update', 'matrix-rain'],
    cta: {
      text: 'Create Broken Screen',
      action: 'open-tool',
    },
  },
  'hacker-typer': {
    toolId: 'hacker-typer',
    title: 'Hacker Typer - Fake Hacking Terminal Simulator',
    description: 'Simulate realistic hacking with the Hacker Typer tool. Watch authentic terminal code appear as you type. Perfect for pranks and fun.',
    keywords: ['hacker typer', 'fake hacking', 'terminal simulator', 'hacker prank', 'code simulator'],
    ogTitle: 'Hacker Typer - Realistic Terminal Simulator',
    ogDescription: 'Simulate hacking with realistic terminal code and effects',
    ogImage: '/og-hacker-typer.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      typingSpeed: 'fast',
      codeStyle: 'matrix',
    },
    useCases: [
      'Prank your friends',
      'Funny video content',
      'Terminal simulation',
      'Hacker aesthetic',
    ],
    benefits: [
      'Realistic terminal effect',
      'Authentic code output',
      'Easy to use',
      'Great for pranks',
    ],
    relatedTools: ['broken-screen', 'fake-windows-update', 'matrix-rain'],
    cta: {
      text: 'Start Hacking',
      action: 'open-tool',
    },
  },
  'fake-windows-update': {
    toolId: 'fake-windows-update',
    title: 'Fake Windows Update - Prank Windows Update Screen',
    description: 'Create a realistic fake Windows update screen to prank your friends. Includes authentic UI and progress bar animation.',
    keywords: ['fake windows update', 'windows update prank', 'fake update screen', 'prank screen', 'windows prank'],
    ogTitle: 'Fake Windows Update - Realistic Update Prank',
    ogDescription: 'Prank your friends with a realistic fake Windows update screen',
    ogImage: '/og-fake-windows-update.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      updatePercentage: 0,
      autoProgress: true,
    },
    useCases: [
      'Prank your friends',
      'Office pranks',
      'Funny video content',
      'Social media pranks',
    ],
    benefits: [
      'Authentic Windows UI',
      'Realistic progress bar',
      'Easy to use',
      'Hilarious reactions',
    ],
    relatedTools: ['broken-screen', 'hacker-typer', 'matrix-rain'],
    cta: {
      text: 'Create Fake Update',
      action: 'open-tool',
    },
  },
  'color-screen': {
    toolId: 'color-screen',
    title: 'Color Screen - Full Screen Color Display Tool',
    description: 'Display any color in full screen. Perfect for testing displays, photography, or design work. Includes color picker and preset colors.',
    keywords: ['color screen', 'full screen color', 'color display', 'color picker', 'display test'],
    ogTitle: 'Color Screen - Full Screen Color Display',
    ogDescription: 'Display any color in full screen with color picker and presets',
    ogImage: '/og-color-screen.png',
    twitterCard: 'summary_large_image',
    preConfiguredState: {
      color: '#FF0000',
    },
    useCases: [
      'Test display colors',
      'Photography reference',
      'Design work',
      'Color calibration',
    ],
    benefits: [
      'Any color available',
      'Full screen display',
      'Color picker included',
      'PNG download option',
    ],
    relatedTools: ['white-screen', 'rgb-screen', 'black-screen'],
    cta: {
      text: 'Pick a Color',
      action: 'open-tool',
    },
  },
};

/**
 * Get landing page config for a tool
 */
export function getToolLandingPageConfig(toolId: string): ToolLandingPageConfig | null {
  return TOOL_LANDING_PAGES[toolId] || null;
}

/**
 * Get all tool landing page configs
 */
export function getAllToolLandingPages(): ToolLandingPageConfig[] {
  return Object.values(TOOL_LANDING_PAGES);
}

/**
 * Generate meta tags for a tool landing page
 */
export function generateToolMetaTags(config: ToolLandingPageConfig): Record<string, string> {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    'og:title': config.ogTitle,
    'og:description': config.ogDescription,
    'og:image': config.ogImage,
    'og:type': 'website',
    'twitter:card': config.twitterCard,
    'twitter:title': config.ogTitle,
    'twitter:description': config.ogDescription,
    'twitter:image': config.ogImage,
  };
}

/**
 * Generate structured data (JSON-LD) for a tool landing page
 */
export function generateToolStructuredData(config: ToolLandingPageConfig): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: config.title,
    description: config.description,
    applicationCategory: 'Utility',
    url: `https://www.purewhitescreen.online/tools/${config.toolId}`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000+',
    },
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateToolBreadcrumbs(toolId: string, toolName: string): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.purewhitescreen.online',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tools',
        item: 'https://www.purewhitescreen.online/tools',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: toolName,
        item: `https://www.purewhitescreen.online/tools/${toolId}`,
      },
    ],
  };
}

/**
 * Generate FAQ structured data for a tool
 */
export function generateToolFAQ(toolId: string): Record<string, any> {
  const config = getToolLandingPageConfig(toolId);
  if (!config) return {};

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${config.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: config.description,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${config.title} free?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Pure White Screen tools are completely free to use. No signup required, no ads, no hidden fees.',
        },
      },
      {
        '@type': 'Question',
        name: `What are the use cases for ${config.title}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: config.useCases.join(', '),
        },
      },
    ],
  };
}

/**
 * Generate URL path for tool
 */
export function getToolPath(toolId: string): string {
  return `/tools/${toolId}`;
}

/**
 * Get related tools for cross-linking
 */
export function getRelatedTools(toolId: string): ToolLandingPageConfig[] {
  const config = getToolLandingPageConfig(toolId);
  if (!config) return [];

  return config.relatedTools
    .map(id => getToolLandingPageConfig(id))
    .filter((c): c is ToolLandingPageConfig => c !== null);
}

/**
 * Generate sitemap entries for all tools
 */
export function generateToolSitemapEntries(): string[] {
  return Object.keys(TOOL_LANDING_PAGES).map(toolId => getToolPath(toolId));
}

/**
 * Search tools by keyword
 */
export function searchTools(query: string): ToolLandingPageConfig[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(TOOL_LANDING_PAGES).filter(
    config =>
      config.title.toLowerCase().includes(lowerQuery) ||
      config.description.toLowerCase().includes(lowerQuery) ||
      config.keywords.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: 'productivity' | 'testing' | 'pranks' | 'effects'): ToolLandingPageConfig[] {
  const categoryMap: Record<string, string[]> = {
    productivity: ['pomodoro', 'ambient-ocean', 'ambient-rain'],
    testing: ['white-screen', 'color-screen', 'rgb-screen', 'black-screen'],
    pranks: ['broken-screen', 'hacker-typer', 'fake-windows-update'],
    effects: ['matrix-rain', 'crt-effect', 'ambient-ocean'],
  };

  return (categoryMap[category] || [])
    .map(id => getToolLandingPageConfig(id))
    .filter((c): c is ToolLandingPageConfig => c !== null);
}
