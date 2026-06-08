import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, Play } from 'lucide-react';
import { Link } from 'wouter';

export function InteractivePreview() {
  const [isActive, setIsActive] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'white' | 'rgb' | 'test'>('white');

  const modes = [
    { id: 'white', label: 'White Screen', color: 'bg-white', icon: '⚪' },
    { id: 'rgb', label: 'RGB Mode', color: 'bg-gradient-to-r from-red-500 via-green-500 to-blue-500', icon: '🌈' },
    { id: 'test', label: 'Dead Pixel Test', color: 'bg-black', icon: '🔍' },
  ];

  const getPreviewContent = () => {
    switch (selectedMode) {
      case 'white':
        return <div className="w-full h-full bg-white" />;
      case 'rgb':
        return (
          <div className="w-full h-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl font-bold mb-2">RGB Test</div>
              <div className="text-sm">Professional color calibration</div>
            </div>
          </div>
        );
      case 'test':
        return (
          <div className="w-full h-full bg-black flex items-center justify-center">
            <div className="grid grid-cols-4 gap-4 p-8">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-12 h-12 bg-white rounded"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="relative w-full max-w-2xl mx-auto mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      {/* Preview Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[oklch(0.5_0.15_280)] bg-black/50 backdrop-blur-md shadow-2xl">
        {/* Preview Display */}
        <div className="aspect-video bg-black relative overflow-hidden">
          {isActive ? (
            getPreviewContent()
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-black">
              <motion.div
                className="text-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Play className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <p className="text-white text-lg font-semibold">Click to Preview</p>
              </motion.div>
            </div>
          )}
        </div>

        {/* Mode Selector */}
        <div className="p-6 bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm border-t border-[oklch(0.5_0.15_280)]">
          <p className="text-sm text-[oklch(0.7_0.02_0)] mb-4">Try different modes:</p>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {modes.map((mode) => (
              <motion.button
                key={mode.id}
                onClick={() => {
                  setSelectedMode(mode.id as 'white' | 'rgb' | 'test');
                  setIsActive(true);
                }}
                className={`p-3 rounded-lg transition-all ${
                  selectedMode === mode.id
                    ? 'bg-cyan-500/30 border-2 border-cyan-400 text-cyan-300'
                    : 'bg-slate-700/50 border border-slate-600 text-slate-300 hover:bg-slate-600/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-xl mb-1">{mode.icon}</div>
                <div className="text-xs font-medium">{mode.label}</div>
              </motion.button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <Link href={`/${selectedMode === 'white' ? 'white-screen' : selectedMode === 'rgb' ? 'color-screen' : 'dead-pixel-test'}`}>
              <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold">
                <Zap className="w-4 h-4 mr-2" />
                Launch Full Screen
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsActive(!isActive)}
            >
              {isActive ? 'Stop Preview' : 'Start Preview'}
            </Button>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <motion.div
        className="absolute -top-4 right-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ✨ Try it now - No signup required
      </motion.div>
    </motion.div>
  );
}
