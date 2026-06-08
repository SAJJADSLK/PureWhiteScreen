import React, { useEffect } from 'react';
import { ToolLandingPage } from './ToolLandingPage';
import { 
  getToolLandingPageConfig,
  generateToolMetaTags,
  generateToolStructuredData,
  generateToolBreadcrumbs,
} from '@/lib/toolLandingPages';
import { updatePageMetadata } from '@/lib/seoOptimization';

interface ToolLandingPageWrapperProps {
  params: { toolId: string };
}

/**
 * Wrapper component that handles:
 * 1. SEO meta tag injection into document head
 * 2. Structured data (JSON-LD) injection with cleanup
 * 3. Canonical URL setup
 * 4. Tool launch navigation
 */
export function ToolLandingPageWrapper({ params }: ToolLandingPageWrapperProps) {
  const { toolId } = params;
  const config = getToolLandingPageConfig(toolId);

  useEffect(() => {
    if (!config) return;

    // Generate and inject SEO metadata
    const metaTags = generateToolMetaTags(config);
    const canonicalUrl = `${window.location.origin}/tools/${toolId}`;

    updatePageMetadata({
      title: config.title,
      description: config.description,
      keywords: config.keywords,
      ogTitle: config.ogTitle,
      ogDescription: config.ogDescription,
      ogImage: config.ogImage,
      ogUrl: canonicalUrl,
      twitterCard: config.twitterCard,
      twitterTitle: config.ogTitle,
      twitterDescription: config.ogDescription,
      canonicalUrl,
    });

    // Inject structured data (JSON-LD) with cleanup markers
    const breadcrumbs = generateToolBreadcrumbs(toolId, config.title);
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify(breadcrumbs);
    breadcrumbScript.setAttribute('data-tool-id', toolId);
    breadcrumbScript.setAttribute('data-type', 'breadcrumb');
    document.head.appendChild(breadcrumbScript);

    // Also add the tool-specific structured data
    const toolStructuredData = generateToolStructuredData(config);
    const toolScript = document.createElement('script');
    toolScript.type = 'application/ld+json';
    toolScript.textContent = JSON.stringify(toolStructuredData);
    toolScript.setAttribute('data-tool-id', toolId);
    toolScript.setAttribute('data-type', 'tool');
    document.head.appendChild(toolScript);

    // Update Open Graph image URL to absolute
    const ogImageMeta = document.querySelector('meta[property="og:image"]');
    if (ogImageMeta && config.ogImage) {
      const absoluteImageUrl = config.ogImage.startsWith('http')
        ? config.ogImage
        : `${window.location.origin}${config.ogImage}`;
      ogImageMeta.setAttribute('content', absoluteImageUrl);
    }

    // Cleanup function to remove injected scripts when component unmounts or toolId changes
    return () => {
      // Remove previously injected JSON-LD scripts for this tool
      const selector = `script[data-tool-id="${toolId}"]`;
      document.querySelectorAll(selector).forEach(script => {
        script.remove();
      });
    };
  }, [config, toolId]);

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
          <p className="text-gray-400">The tool "{toolId}" does not exist.</p>
          <a href="/" className="text-cyan-400 hover:underline mt-4 inline-block">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const handleLaunchTool = (launchToolId: string, state?: Record<string, any>) => {
    // Navigate to the tool with pre-configured state
    if (state) {
      // Encode state in URL query parameters
      const params = new URLSearchParams();
      Object.entries(state).forEach(([key, value]) => {
        params.set(key, JSON.stringify(value));
      });
      window.location.href = `/${launchToolId}?${params.toString()}`;
    } else {
      window.location.href = `/${launchToolId}`;
    }
  };

  return <ToolLandingPage toolId={toolId} onLaunchTool={handleLaunchTool} />;
}
