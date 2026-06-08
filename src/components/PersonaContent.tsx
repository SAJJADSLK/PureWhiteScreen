import { motion } from 'framer-motion';
import { Code2, Clapperboard, Palette, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

const personas = [
  {
    id: 'developers',
    title: 'For Developers',
    subtitle: 'Test & Debug',
    description: 'Responsive testing, dead pixel detection, color calibration for cross-device development.',
    icon: Code2,
    color: 'from-blue-500 to-cyan-500',
    tools: ['Dead Pixel Test', 'Color Screen', 'Brightness Calibration'],
    cta: '/dead-pixel-test',
  },
  {
    id: 'creators',
    title: 'For Content Creators',
    subtitle: 'Stream & Record',
    description: 'Professional lighting, green screen, teleprompter, and ambient spaces for high-quality content.',
    icon: Clapperboard,
    color: 'from-purple-500 to-pink-500',
    tools: ['Ring Light', 'Green Screen', 'Teleprompter'],
    cta: '/ring-light',
  },
  {
    id: 'designers',
    title: 'For Designers',
    subtitle: 'Create & Inspire',
    description: 'Color exploration, neon effects, ambient inspiration, and creative visual tools.',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    tools: ['Neon Sign', 'Ambient Spaces', 'Color Screen'],
    cta: '/neon-sign',
  },
];

export function PersonaContent() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Built for Your Workflow
          </h2>
          <p className="text-xl text-[oklch(0.7_0.02_0)] max-w-2xl mx-auto">
            Whether you're a developer, creator, or designer, Pure White Screen has the perfect tools for you.
          </p>
        </motion.div>

        {/* Persona Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {personas.map((persona, index) => {
            const Icon = persona.icon;
            return (
              <motion.div
                key={persona.id}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Card Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 group-hover:border-cyan-500/50 transition-colors duration-300" />

                {/* Gradient Overlay on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative p-8 h-full flex flex-col">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${persona.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-2xl font-bold text-white mb-2">{persona.title}</h3>
                  <p className="text-sm font-semibold text-cyan-400 mb-3">{persona.subtitle}</p>

                  {/* Description */}
                  <p className="text-[oklch(0.7_0.02_0)] mb-6 flex-grow">
                    {persona.description}
                  </p>

                  {/* Tools List */}
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                      Popular Tools
                    </p>
                    <div className="space-y-2">
                      {persona.tools.map((tool) => (
                        <div key={tool} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                          <span className="text-sm text-[oklch(0.7_0.02_0)]">{tool}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Link href={persona.cta}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button className="w-full bg-slate-700 hover:bg-slate-600 text-white border border-slate-600 hover:border-cyan-500/50 transition-all">
                        Explore Tools
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
