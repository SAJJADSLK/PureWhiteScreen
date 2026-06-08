import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useSharedPreset } from "@/hooks/useSharedPreset";
import { useEffect } from "react";
import { InteractivePreview } from "@/components/InteractivePreview";
import { SocialProof } from "@/components/SocialProof";
import { PersonaContent } from "@/components/PersonaContent";
import { CommunityLinks } from "@/components/CommunityLinks";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";

const previewModes = [
  { name: "White Screen", path: "/white-screen", color: "bg-white" },
  { name: "Black Screen", path: "/black-screen", color: "bg-black" },
  { name: "RGB Mode", path: "/color-screen", color: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500" },
  { name: "Dead Pixel Test", path: "/dead-pixel-test", color: "bg-gradient-to-br from-yellow-400 to-red-500" },
  { name: "Focus Mode", path: "/pomodoro", color: "bg-gradient-to-br from-purple-600 to-blue-600" },
  { name: "Ring Light", path: "/ring-light", color: "bg-gradient-to-br from-yellow-300 to-orange-500" },
  { name: "Ambient Ocean", path: "/ambient/ocean", color: "bg-gradient-to-br from-blue-600 to-cyan-400" },
];

const useCases = [
  { icon: "📸", name: "Photography", description: "Professional lighting setup" },
  { icon: "🎬", name: "Streaming", description: "Ring light & RGB modes" },
  { icon: "🎮", name: "Gaming", description: "Ambient spaces & effects" },
  { icon: "🎯", name: "Focus", description: "Pomodoro & distraction-free" },
  { icon: "😴", name: "Sleep", description: "Ambient fireplace & ocean" },
  { icon: "🔧", name: "Testing", description: "Dead pixel & calibration" },
  { icon: "🎓", name: "Classroom", description: "Teleprompter & green screen" },
  { icon: "🆘", name: "Emergency", description: "Instant light source" },
];

const instantModes = [
  { name: "Warm Light", path: "/ring-light", color: "from-orange-400 to-yellow-300" },
  { name: "Cold Light", path: "/ring-light", color: "from-blue-400 to-cyan-300" },
  { name: "Zoom Light", path: "/ring-light", color: "from-purple-400 to-pink-300" },
  { name: "TikTok Light", path: "/ring-light", color: "from-pink-500 to-purple-500" },
  { name: "Coding Focus", path: "/pomodoro", color: "from-green-400 to-blue-500" },
  { name: "Cinema Black", path: "/black-screen", color: "from-gray-900 to-black" },
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
    transition: { duration: 0.6, ease: "easeOut" as any },
  },
};

export default function Home() {
  const { config: sharedConfig, isLoading: isLoadingShared } = useSharedPreset();

  // Log shared config when loaded (for debugging)
  useEffect(() => {
    if (sharedConfig) {
      console.log('Shared preset config loaded:', sharedConfig);
    }
  }, [sharedConfig]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
        {/* Animated background elements */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-[oklch(0.65_0.25_280)] rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            y: [0, 30, 0],
            x: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-72 h-72 bg-[oklch(0.7_0.25_180)] rounded-full mix-blend-screen filter blur-3xl opacity-20"
          animate={{
            y: [0, -30, 0],
            x: [0, -20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 1 }}
        />

        <motion.div
          className="relative z-10 text-center max-w-4xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Transform Any Screen Into a Studio
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-[oklch(0.7_0.02_0)] mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Professional lighting, focus tools, ambient spaces, and creative effects. Everything you need for content creation, productivity, and fun.
          </motion.p>

          {/* Interactive Preview Widget */}
          <InteractivePreview />

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/white-screen">
              <Button className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white px-8 py-6 text-lg hover:opacity-90 transition-opacity">
                <Zap className="mr-2" size={20} />
                Start Fullscreen
              </Button>
            </Link>
            <Link href="#explore">
              <Button variant="outline" className="px-8 py-6 text-lg border-[oklch(0.7_0.25_180)] text-[oklch(0.7_0.25_180)] hover:bg-[oklch(0.7_0.25_180)_/_10%]">
                Explore Modes
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Preview Grid */}
      <section id="explore" className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Live Preview Grid</h2>
            <p className="text-[oklch(0.7_0.02_0)] text-lg">Hover to see each mode in action</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {previewModes.map((mode) => (
              <motion.div key={mode.path} variants={itemVariants}>
                <Link href={mode.path}>
                  <motion.div
                    className={`relative h-48 rounded-xl overflow-hidden cursor-pointer group border border-[oklch(0.2_0.02_270)] backdrop-blur-sm ${mode.color}`}
                    whileHover={{ scale: 1.05, borderColor: "oklch(0.7 0.25 180)" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-white mb-2">{mode.name}</h3>
                        <p className="text-sm text-[oklch(0.7_0.02_0)]">Click to launch</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Popular Uses */}
      <section className="py-20 px-4 bg-[oklch(0.1_0.02_265)_/_50%)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Popular Uses</h2>
            <p className="text-[oklch(0.7_0.02_0)] text-lg">Whatever you need, ScreenLab has you covered</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {useCases.map((useCase) => (
              <motion.div
                key={useCase.name}
                variants={itemVariants}
                className="p-6 rounded-xl bg-[oklch(0.12_0.02_270)] border border-[oklch(0.2_0.02_270)] hover:border-[oklch(0.7_0.25_180)] transition-all duration-300 text-center group cursor-pointer"
                whileHover={{ y: -5 }}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{useCase.icon}</div>
                <h3 className="font-bold text-white mb-2">{useCase.name}</h3>
                <p className="text-sm text-[oklch(0.7_0.02_0)]">{useCase.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Instant Modes */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Instant Modes</h2>
            <p className="text-[oklch(0.7_0.02_0)] text-lg">One click to launch your favorite setup</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {instantModes.map((mode) => (
              <motion.div key={mode.name} variants={itemVariants}>
                <Link href={mode.path}>
                  <motion.div
                    className={`relative h-32 rounded-xl overflow-hidden cursor-pointer group border border-[oklch(0.2_0.02_270)] bg-gradient-to-br ${mode.color}`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-bold text-white">{mode.name}</h3>
                        <p className="text-xs text-white/70 mt-1">Launch instantly</p>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Before/After Comparison */}
      <section className="py-20 px-4 bg-[oklch(0.1_0.02_265)_/_50%)]">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">See the Difference</h2>
            <p className="text-[oklch(0.7_0.02_0)] text-lg">Drag the slider to compare tool effects</p>
          </motion.div>

          <BeforeAfterSlider
            beforeImage="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Crect fill='%23333' width='800' height='450'/%3E%3Ctext x='400' y='225' font-size='32' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EOriginal Screen%3C/text%3E%3C/svg%3E"
            afterImage="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23ff00ff;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%2300ffff;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='url(%23grad)' width='800' height='450'/%3E%3Ctext x='400' y='225' font-size='32' fill='%23fff' text-anchor='middle' dominant-baseline='middle'%3EEnhanced Screen%3C/text%3E%3C/svg%3E"
            beforeLabel="Original"
            afterLabel="Enhanced"
            title="RGB Mode Enhancement"
            description="Professional color calibration and enhancement"
          />
        </div>
      </section>

      {/* Persona-Based Content */}
      <PersonaContent />

      {/* Social Proof Section */}
      <SocialProof />

      {/* Community Links */}
      <CommunityLinks />

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] rounded-2xl p-12 text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Screen?</h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Access all tools, save your presets, and unlock premium features with a free account.
            </p>
            <Link href="/white-screen">
              <Button className="bg-white text-[oklch(0.65_0.25_280)] hover:bg-white/90 px-8 py-6 text-lg font-bold">
                Get Started Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
