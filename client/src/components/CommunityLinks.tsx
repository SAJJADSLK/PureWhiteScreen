import { motion } from 'framer-motion';
import { Github, MessageCircle, Heart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

const communityLinks = [
  {
    icon: Github,
    title: 'GitHub',
    description: 'Star us on GitHub and contribute',
    url: 'https://github.com/screenlab/screenlab',
    color: 'from-gray-600 to-gray-800',
  },
  {
    icon: MessageCircle,
    title: 'Discord Community',
    description: 'Join our community chat',
    url: 'https://discord.gg/screenlab-community',
    color: 'from-purple-600 to-purple-800',
  },
  {
    icon: Heart,
    title: 'Product Hunt',
    description: 'Support us on Product Hunt',
    url: 'https://www.producthunt.com/products/screenlab',
    color: 'from-orange-600 to-red-600',
  },
];

export function CommunityLinks() {
  return (
    <section className="py-16 px-4 bg-slate-900/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-white mb-3">Join the Community</h3>
          <p className="text-[oklch(0.7_0.02_0)]">
            Connect with creators, developers, and designers using ScreenLab
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {communityLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 group-hover:border-cyan-500/50 transition-colors duration-300" />

                <div className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300`} />

                <div className="relative p-6 text-center">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${link.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{link.title}</h4>
                  <p className="text-sm text-[oklch(0.7_0.02_0)] mb-4">{link.description}</p>

                  <div className="flex items-center justify-center gap-2 text-cyan-400 group-hover:gap-3 transition-all">
                    <span className="text-sm font-semibold">Visit</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
