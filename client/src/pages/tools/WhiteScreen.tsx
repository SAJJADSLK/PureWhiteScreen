import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Maximize, Minimize, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toggleFullscreen, exitFullscreen } from "@/lib/fullscreenUtils";

export default function WhiteScreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [showControls, setShowControls] = useState(true);
  const [hideControlsTimer, setHideControlsTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        handleToggleFullscreen();
      } else if (e.key === "Escape") {
        if (isFullscreen) {
          handleExitFullscreen();
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideControlsTimer) clearTimeout(hideControlsTimer);
      const timer = setTimeout(() => setShowControls(false), 3000);
      setHideControlsTimer(timer);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hideControlsTimer) clearTimeout(hideControlsTimer);
    };
  }, [hideControlsTimer]);

  const handleToggleFullscreen = async () => {
    const success = await toggleFullscreen(isFullscreen);
    if (success) {
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleExitFullscreen = async () => {
    const success = await exitFullscreen();
    if (success) {
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center transition-all duration-300"
      style={{
        backgroundColor: `rgba(255, 255, 255, ${brightness / 100})`,
      }}
      onMouseMove={() => {
        setShowControls(true);
        if (hideControlsTimer) clearTimeout(hideControlsTimer);
        const timer = setTimeout(() => setShowControls(false), 3000);
        setHideControlsTimer(timer);
      }}
    >
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-auto"
      >
        <div className="bg-black/80 backdrop-blur-md rounded-full px-6 py-4 flex items-center gap-6 border border-white/20">
          {/* Brightness Control */}
          <div className="flex items-center gap-3 min-w-48">
            <Volume2 size={20} className="text-white" />
            <Slider
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              min={10}
              max={100}
              step={1}
              className="w-32"
            />
            <span className="text-white text-sm min-w-12">{brightness}%</span>
          </div>

          {/* Fullscreen Button */}
          <Button
            onClick={handleToggleFullscreen}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20"
            title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>

          {/* Keyboard Shortcuts */}
          <div className="text-white/60 text-xs hidden sm:block">
            <p>F: Fullscreen | ESC: Exit</p>
          </div>
        </div>
      </motion.div>

      {/* Info Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showControls ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-24 left-1/2 transform -translate-x-1/2 text-center pointer-events-none"
      >
        <h1 className="text-4xl font-bold text-black/20">White Screen</h1>
        <p className="text-black/10 mt-2">Press F for fullscreen • Move mouse to show controls</p>
      </motion.div>
    </div>
  );
}
