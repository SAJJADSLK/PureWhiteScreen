import { motion } from 'framer-motion';
import { Star, Users, Clock, TrendingUp } from 'lucide-react';
import { useAnalytics, formatMetricValue, formatRating } from '@/hooks/useAnalytics';

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    name: 'Alex Chen',
    role: 'Content Creator & Streamer',
    avatar: '👨‍💻',
    quote: 'Pure White Screen transformed my streaming setup. The ring light simulator alone saves me hours of setup time. I use it every single day.',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'UI/UX Designer',
    avatar: '👩‍🎨',
    quote: 'Perfect for testing color accuracy and responsive designs. It\'s become an essential tool in my workflow. Can\'t imagine working without it.',
    rating: 5,
  },
  {
    name: 'Mike Rodriguez',
    role: 'Full Stack Developer',
    avatar: '👨‍💼',
    quote: 'The dead pixel test and calibration tools are incredibly accurate. I use it to verify monitor quality before purchasing. Highly recommended!',
    rating: 5,
  },
  {
    name: 'Emma Thompson',
    role: 'Video Producer',
    avatar: '👩‍🎬',
    quote: 'The ambient spaces and focus mode features help me stay productive during long editing sessions. Best tool for creators.',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Photography Enthusiast',
    avatar: '📸',
    quote: 'The brightness calibration and color picker tools are game-changers for photography lighting. Absolutely worth it.',
    rating: 5,
  },
];

const metrics = [
  { icon: Users, label: 'Free Tools', value: '20+', color: 'from-blue-500 to-cyan-500' },
  { icon: Clock, label: 'No Signup', value: 'Instant', color: 'from-purple-500 to-pink-500' },
  { icon: TrendingUp, label: 'No Ads', value: 'Ever', color: 'from-green-500 to-emerald-500' },
  { icon: Star, label: 'Open Source', value: 'MIT', color: 'from-yellow-500 to-orange-500' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

export function SocialProof() {
  const analytics = useAnalytics();

  // Create dynamic metrics from analytics data
  const dynamicMetrics = [
    { icon: Users, label: 'Active Users', value: `${formatMetricValue(analytics.activeUsers)}+`, color: 'from-blue-500 to-cyan-500' },
    { icon: Clock, label: 'Hours Saved', value: `${formatMetricValue(analytics.hoursSaved)}+`, color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Screens Optimized', value: `${formatMetricValue(analytics.screensOptimized)}+`, color: 'from-green-500 to-emerald-500' },
    { icon: Star, label: 'Avg Rating', value: `${formatRating(analytics.averageRating)}/5`, color: 'from-yellow-500 to-orange-500' },
  ];

  // Unused metrics array - kept for reference
  void metrics;

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Metrics Section */}
        <motion.div
          className="mb-20"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
            variants={itemVariants}
          >
            Trusted by Thousands
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {dynamicMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={index}
                  className={`relative p-6 rounded-xl bg-gradient-to-br ${metric.color} bg-opacity-10 border border-white/10 backdrop-blur-sm hover:border-white/20 transition-all group`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity" />
                  <div className="relative z-10">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${metric.color} mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {analytics.loading ? (
                        <span className="animate-pulse">--</span>
                      ) : (
                        metric.value
                      )}
                    </div>
                    <div className="text-sm text-[oklch(0.7_0.02_0)]">{metric.label}</div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white text-center mb-12"
            variants={itemVariants}
          >
            What Users Say
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-white/10 backdrop-blur-sm hover:border-cyan-400/30 transition-all"
                variants={itemVariants}
                whileHover={{ y: -8 }}
              >
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-white mb-6 leading-relaxed italic">"{testimonial.quote}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-[oklch(0.7_0.02_0)]">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          className="mt-20 flex flex-wrap justify-center gap-6 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >

          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            variants={itemVariants}
            title="SSL/TLS encryption enabled"
          >
            <span className="text-lg">🔒</span>
            <span className="text-sm text-white">SSL Secured</span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            variants={itemVariants}
            title="Open source on GitHub"
          >
            <span className="text-lg">🔓</span>
            <span className="text-sm text-white">Open Source</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
