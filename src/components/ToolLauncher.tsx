import { useState } from "react";
import { Link } from "wouter";
import { Grid3x3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tools = [
  { name: "White Screen", path: "/white-screen", icon: "⚪" },
  { name: "Black Screen", path: "/black-screen", icon: "⚫" },
  { name: "Color Screen", path: "/color-screen", icon: "🎨" },
  { name: "Gray Balance", path: "/gray-balance", icon: "⚖️" },
  { name: "Brightness", path: "/brightness-calibration", icon: "☀️" },
  { name: "Dead Pixel Test", path: "/dead-pixel-test", icon: "🔍" },
  { name: "Ring Light", path: "/ring-light", icon: "💡" },
  { name: "Green Screen", path: "/green-screen", icon: "🟢" },
  { name: "Teleprompter", path: "/teleprompter", icon: "📝" },
  { name: "Pomodoro", path: "/pomodoro", icon: "⏱️" },
  { name: "Focus Mode", path: "/focus-mode", icon: "🧘" },
  { name: "Sound Mixer", path: "/sound-mixer", icon: "🎵" },
  { name: "Matrix Rain", path: "/matrix-rain", icon: "🟩" },
  { name: "Starfield", path: "/starfield", icon: "⭐" },
  { name: "CRT Effect", path: "/crt-effect", icon: "📺" },
  { name: "Neon Sign", path: "/neon-sign", icon: "🌟" },
  { name: "Fireplace", path: "/ambient/fireplace", icon: "🔥" },
  { name: "Ocean", path: "/ambient/ocean", icon: "🌊" },
  { name: "Forest", path: "/ambient/forest", icon: "🌲" },
  { name: "Northern Lights", path: "/ambient/northern-lights", icon: "🌌" },
  { name: "Broken Screen", path: "/broken-screen", icon: "💔" },
  { name: "Hacker Typer", path: "/hacker-typer", icon: "⌨️" },
  { name: "Fake Update", path: "/fake-windows-update", icon: "⚙️" },
];

export default function ToolLauncher() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Grid3x3 size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tools Grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-8 z-40 bg-[oklch(0.12_0.02_270)] border border-[oklch(0.2_0.02_270)] rounded-lg shadow-2xl p-4 w-80 max-h-96 overflow-y-auto backdrop-blur-md"
          >
            <div className="grid grid-cols-2 gap-2">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.path}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    href={tool.path}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-[oklch(0.15_0.02_270)] hover:bg-[oklch(0.2_0.02_270)] border border-[oklch(0.2_0.02_270)] hover:border-[oklch(0.7_0.25_180)] transition-all duration-200 group cursor-pointer"
                  >
                    <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                      {tool.icon}
                    </span>
                    <span className="text-xs text-center text-[oklch(0.7_0.02_0)] group-hover:text-[oklch(0.7_0.25_180)] transition-colors line-clamp-2">
                      {tool.name}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-30 bg-black/20"
          />
        )}
      </AnimatePresence>
    </>
  );
}
