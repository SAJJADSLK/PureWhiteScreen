import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getToolLandingPageConfig } from '@/lib/toolLandingPages';

interface ToolLandingPageProps {
  toolId: string;
  onLaunchTool: (toolId: string, state?: Record<string, any>) => void;
}

/**
 * Tool Landing Page Component
 * Displays SEO-optimized landing page for each tool with pre-configured state
 */
export function ToolLandingPage({ toolId, onLaunchTool }: ToolLandingPageProps) {
  const config = getToolLandingPageConfig(toolId);

  if (!config) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Tool Not Found</h1>
          <p className="text-gray-400">The requested tool could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[oklch(0.08_0.02_270)] to-[oklch(0.06_0.02_270)]">
      {/* SEO Meta Tags (handled by react-helmet in App.tsx) */}

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            {config.title}
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            {config.description}
          </p>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() =>
                onLaunchTool(toolId, config.preConfiguredState)
              }
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Launch {config.title}
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Use Cases Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[oklch(0.1_0.02_270)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Perfect For
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.useCases.map((useCase: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-[oklch(0.12_0.02_270)] border-[oklch(0.2_0.02_270)] p-6 hover:border-cyan-500 transition-colors">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {useCase}
                  </h3>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Why Choose {config.title}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {config.benefits.map((benefit: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-4"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-cyan-500 bg-opacity-10 text-cyan-500">
                    ✓
                  </div>
                </div>
                <div>
                  <p className="text-white font-medium">{benefit}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* Related Tools Section */}
      {config.relatedTools && config.relatedTools.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {config.relatedTools.map((relatedTool: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="bg-[oklch(0.12_0.02_270)] border-[oklch(0.2_0.02_270)] p-6 hover:border-cyan-500 transition-colors cursor-pointer"
                    onClick={() => onLaunchTool(relatedTool)}
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {relatedTool}
                    </h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Footer */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-cyan-500 bg-opacity-5 to-blue-600 bg-opacity-5"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Try {config.title} now — completely free, no signup required.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() =>
                onLaunchTool(toolId, config.preConfiguredState)
              }
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg"
            >
              Launch {config.title} Now
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
