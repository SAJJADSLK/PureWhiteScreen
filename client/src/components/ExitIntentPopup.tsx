import { useState, useEffect } from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitIntentPopupProps {
  onClose?: () => void;
}

/**
 * Exit-intent popup that appears when user moves mouse toward top of page
 * Offers downloadable resource: "50 Pro Tips for Screen Optimization"
 */
export function ExitIntentPopup({ onClose }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    // Check if popup was already shown in this session
    const shown = sessionStorage.getItem('exit_intent_shown');
    if (shown) {
      setHasShown(true);
      return;
    }

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is moving toward top of page
      if (e.clientY <= 0 && !hasShown && !isVisible) {
        setIsVisible(true);
        sessionStorage.setItem('exit_intent_shown', 'true');
        setHasShown(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [hasShown, isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const handleDownload = async () => {
    if (!email.trim()) {
      alert('Please enter your email to download');
      return;
    }

    setIsDownloading(true);

    try {
      // Simulate download - in production, this would call a backend API
      // to log the email and send the resource
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a blob for the resource
      const content = `
SCREENLAB: 50 PRO TIPS FOR SCREEN OPTIMIZATION
============================================

1. White Screen Optimization
   - Use for brightness calibration
   - Perfect for testing display uniformity
   - Ideal for photography lighting setups

2. Color Screen Mastery
   - RGB mode for color accuracy testing
   - Use for video production color grading
   - Test monitor color reproduction

3. Ring Light Simulation
   - Warm mode: 3000K for cozy streaming
   - Cool mode: 5600K for professional look
   - RGB mode: Custom color combinations

4. Focus Mode Productivity
   - Pomodoro: 25min work + 5min break
   - Ambient sounds: Rain, cafe, white noise
   - Distraction-free interface

5. Dead Pixel Detection
   - Use black screen to find dead pixels
   - Use white screen to find stuck pixels
   - Test across full brightness range

... and 45 more tips for professional screen optimization!
      `;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screenlab-50-pro-tips.txt';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Log email for follow-up
      console.log('User email for resource:', email);

      handleClose();
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div className="bg-gradient-to-br from-[oklch(0.12_0.02_270)] to-[oklch(0.1_0.02_270)] border border-[oklch(0.2_0.02_270)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-md">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[oklch(0.7_0.02_0)] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Content */}
            <div className="p-6 pt-8">
              <h3 className="text-xl font-bold text-white mb-2">Wait! Don't Miss Out</h3>
              <p className="text-sm text-[oklch(0.7_0.02_0)] mb-4">
                Get our exclusive guide: <strong>50 Pro Tips for Screen Optimization</strong>
              </p>

              {/* Email input */}
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[oklch(0.08_0.02_270)] border border-[oklch(0.2_0.02_270)] text-white placeholder-[oklch(0.5_0.02_0)] focus:outline-none focus:border-[oklch(0.7_0.25_180)] transition-colors"
                  disabled={isDownloading}
                />
              </div>

              {/* Download button */}
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-[oklch(0.65_0.25_280)] to-[oklch(0.7_0.25_180)] text-white hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : 'Download Free Guide'}
              </Button>

              {/* Trust badge */}
              <p className="text-xs text-[oklch(0.5_0.02_0)] mt-4 text-center">
                ✓ No spam • Instant download • Unsubscribe anytime
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
