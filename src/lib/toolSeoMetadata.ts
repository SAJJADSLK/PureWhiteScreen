/**
 * Per-tool SEO metadata for dynamic meta tag generation
 * Used with react-helmet or similar for per-page SEO optimization
 */

export interface ToolMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
}

export const toolMetadata: Record<string, ToolMetadata> = {
  '/white-screen': {
    title: 'Free White Screen Tool | Pure White Screen - Display Brightness Calibration',
    description: 'Professional white screen for brightness calibration, display testing, and photography lighting. Instant fullscreen, no signup required.',
    keywords: ['white screen', 'brightness calibration', 'display test', 'monitor calibration', 'photography lighting'],
    ogType: 'website',
  },
  '/black-screen': {
    title: 'Free Black Screen Tool | Pure White Screen - Dead Pixel Detection',
    description: 'Pure black screen for finding dead pixels and stuck pixels. Test display quality instantly. No ads, no signup.',
    keywords: ['black screen', 'dead pixel test', 'stuck pixel', 'display test', 'monitor quality'],
    ogType: 'website',
  },
  '/color-screen': {
    title: 'Free RGB Color Screen | Pure White Screen - Color Accuracy Testing',
    description: 'RGB color picker and full-screen color display for color accuracy testing, monitor calibration, and photography lighting setup.',
    keywords: ['color screen', 'RGB mode', 'color picker', 'monitor calibration', 'color accuracy'],
    ogType: 'website',
  },
  '/gray-screen': {
    title: 'Free Gray Screen Tool | Pure White Screen - Gray Balance Calibration',
    description: 'Professional gray screen for monitor calibration and color accuracy testing. Perfect for designers and photographers.',
    keywords: ['gray screen', 'gray balance', 'monitor calibration', 'color accuracy', 'display test'],
    ogType: 'website',
  },
  '/brightness-calibration': {
    title: 'Free Brightness Calibration Tool | Pure White Screen',
    description: 'Advanced brightness calibration with gradient patterns and test modes. Optimize your display for professional work.',
    keywords: ['brightness calibration', 'display calibration', 'gradient test', 'monitor optimization'],
    ogType: 'website',
  },
  '/dead-pixel-test': {
    title: 'Free Dead Pixel Test | Pure White Screen - Find Stuck Pixels',
    description: 'Comprehensive dead pixel testing tool with multiple patterns. Detect stuck and dead pixels instantly.',
    keywords: ['dead pixel test', 'stuck pixel', 'pixel test', 'display test', 'monitor quality'],
    ogType: 'website',
  },
  '/ring-light': {
    title: 'Free Ring Light Simulator | Pure White Screen - Streaming & Photography',
    description: 'Professional ring light simulator for streaming, content creation, and photography. Warm, cool, and RGB modes.',
    keywords: ['ring light', 'streaming', 'streaming light', 'ring light simulator', 'content creation lighting', 'photography lighting'],
    ogType: 'website',
  },
  '/green-screen': {
    title: 'Free Green Screen Tool | Pure White Screen - Virtual Background',
    description: 'Professional green screen for streaming, video conferencing, and content creation. Instant fullscreen mode.',
    keywords: ['green screen', 'chroma key', 'virtual background', 'streaming', 'video conferencing'],
    ogType: 'website',
  },
  '/teleprompter': {
    title: 'Free Teleprompter Tool | Pure White Screen - Streaming & Presentations',
    description: 'Professional teleprompter with adjustable speed and font size. Perfect for streaming, presentations, and video recording.',
    keywords: ['teleprompter', 'speech prompter', 'streaming teleprompter', 'presentation tool'],
    ogType: 'website',
  },
  '/pomodoro': {
    title: 'Free Pomodoro Timer | Pure White Screen - Focus & Productivity',
    description: 'Customizable Pomodoro timer with ambient sounds. Boost productivity with distraction-free focus sessions.',
    keywords: ['pomodoro timer', 'focus timer', 'productivity timer', 'work timer', 'break timer'],
    ogType: 'website',
  },
  '/focus-mode': {
    title: 'Free Focus Mode | Pure White Screen - Distraction-Free Productivity',
    description: 'Immersive focus mode with Pomodoro timer, ambient sounds, and distraction-free interface. Maximize productivity.',
    keywords: ['focus mode', 'distraction free', 'productivity', 'ambient sounds', 'focus timer'],
    ogType: 'website',
  },
  '/sound-mixer': {
    title: 'Free Ambient Sound Mixer | Pure White Screen - Focus & Relaxation',
    description: 'Mix ambient sounds like rain, white noise, and cafe sounds. Perfect for focus, relaxation, and meditation.',
    keywords: ['ambient sounds', 'white noise', 'sound mixer', 'focus sounds', 'relaxation sounds'],
    ogType: 'website',
  },
  '/matrix-rain': {
    title: 'Free Matrix Rain Effect | Pure White Screen - Digital Rain Animation',
    description: 'Mesmerizing Matrix digital rain effect. Perfect for presentations, backgrounds, and creative content.',
    keywords: ['matrix rain', 'digital rain', 'matrix effect', 'animation', 'screensaver'],
    ogType: 'website',
  },
  '/starfield': {
    title: 'Free Starfield Animation | Pure White Screen - Space Screensaver',
    description: 'Relaxing starfield animation with flying through space effect. Perfect for meditation and ambient backgrounds.',
    keywords: ['starfield', 'space animation', 'screensaver', 'meditation', 'ambient animation'],
    ogType: 'website',
  },
  '/crt-effect': {
    title: 'Free CRT TV Effect | Pure White Screen - Retro Screensaver',
    description: 'Nostalgic CRT TV effect with scanlines. Perfect for retro gaming content and vintage aesthetics.',
    keywords: ['CRT effect', 'retro effect', 'TV effect', 'scanlines', 'vintage screensaver'],
    ogType: 'website',
  },
  '/neon-sign': {
    title: 'Free Neon Sign Generator | Pure White Screen - Custom Neon Text',
    description: 'Create custom neon text effects with glowing animations. Perfect for branding, logos, and creative content.',
    keywords: ['neon sign', 'neon text', 'neon effect', 'glow effect', 'text animation'],
    ogType: 'website',
  },
  '/ambient/fireplace': {
    title: 'Free Fireplace Animation | Pure White Screen - Cozy Ambient Scene',
    description: 'Relaxing fireplace animation. Perfect for ambiance, relaxation, and creating a cozy atmosphere.',
    keywords: ['fireplace', 'ambient scene', 'relaxation', 'cozy', 'animation'],
    ogType: 'website',
  },
  '/ambient/ocean': {
    title: 'Free Ocean Animation | Pure White Screen - Peaceful Ambient Scene',
    description: 'Peaceful ocean waves animation. Perfect for meditation, relaxation, and ambient backgrounds.',
    keywords: ['ocean', 'waves', 'ambient scene', 'meditation', 'relaxation'],
    ogType: 'website',
  },
  '/ambient/forest': {
    title: 'Free Forest Animation | Pure White Screen - Nature Ambient Scene',
    description: 'Serene forest animation with natural sounds. Perfect for focus, relaxation, and nature ambiance.',
    keywords: ['forest', 'nature', 'ambient scene', 'relaxation', 'focus'],
    ogType: 'website',
  },
  '/ambient/northern-lights': {
    title: 'Free Northern Lights Animation | Pure White Screen - Aurora Borealis',
    description: 'Mesmerizing northern lights animation. Perfect for inspiration, relaxation, and ambient backgrounds.',
    keywords: ['northern lights', 'aurora borealis', 'ambient scene', 'animation', 'relaxation'],
    ogType: 'website',
  },
};

/**
 * Get SEO metadata for a tool
 */
export function getToolMetadata(path: string): ToolMetadata | null {
  return toolMetadata[path] || null;
}

/**
 * Generate meta tags for a tool
 */
export function generateToolMetaTags(path: string, baseUrl: string = 'https://www.purewhitescreen.online') {
  const metadata = getToolMetadata(path);
  if (!metadata) return null;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(', '),
    og: {
      title: metadata.title,
      description: metadata.description,
      type: metadata.ogType || 'website',
      url: `${baseUrl}${path}`,
      image: metadata.ogImage || `${baseUrl}/og-image.png`,
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      image: metadata.ogImage || `${baseUrl}/og-image.png`,
    },
  };
}

/**
 * Get all tool paths for sitemap generation
 */
export function getAllToolPaths(): string[] {
  return Object.keys(toolMetadata);
}

/**
 * Get tool count
 */
export function getToolCount(): number {
  return Object.keys(toolMetadata).length;
}
