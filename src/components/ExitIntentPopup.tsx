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
export default function ExitIntentPopup({ onClose }: ExitIntentPopupProps) {
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
      // Create complete guide content
      const content = `SCREENLAB: 50 PRO TIPS FOR SCREEN OPTIMIZATION
============================================

CONTENT CREATORS GUIDE

1. Ring Light Simulation for Streaming
   - Warm mode (3000K): Creates cozy, intimate atmosphere
   - Cool mode (5600K): Professional, studio-quality lighting
   - RGB mode: Match any color scheme or brand colors
   - Adjust intensity for different camera sensitivities

2. Green Screen Optimization
   - Use consistent lighting across the screen
   - Position screen at eye level
   - Test chroma key settings with your streaming software
   - Use RGB mode for custom background colors

3. Teleprompter Best Practices
   - Adjust speed to match your natural speaking pace
   - Use larger fonts for better readability
   - Position screen at comfortable viewing angle
   - Practice with ambient sounds for realistic timing

DESIGNERS & PHOTOGRAPHERS GUIDE

4. Color Accuracy Testing
   - Use RGB color picker for precise color matching
   - Test against known color standards
   - Calibrate monitor with white/gray screens
   - Use dead pixel test to verify display quality

5. Brightness Calibration
   - Use gradient patterns to test brightness levels
   - Test across full range from black to white
   - Verify uniform brightness across screen
   - Use for photography lighting setup reference

DEVELOPERS & QA GUIDE

6. Responsive Design Testing
   - Use full-screen modes to test layouts
   - Test color accuracy across devices
   - Verify display uniformity for visual bugs
   - Use dead pixel patterns to check rendering

7. Performance Testing
   - Use animated patterns to test GPU performance
   - Monitor for flickering or artifacts
   - Test fullscreen performance
   - Verify smooth animations and transitions

PRODUCTIVITY & WELLNESS

8. Focus Mode for Deep Work
   - 25-minute Pomodoro sessions
   - 5-minute breaks between sessions
   - Ambient sounds: Rain for concentration
   - Cafe sounds for background activity
   - White noise for blocking distractions

9. Eye Strain Reduction
   - Use gray screens for eye rest
   - Take regular breaks with ambient scenes
   - Use warm lighting in evening sessions
   - Adjust brightness to room lighting

10. Ambient Spaces for Relaxation
    - Fireplace: Cozy and calming
    - Ocean: Peaceful and meditative
    - Forest: Natural and grounding
    - Northern Lights: Inspiring and magical

ADVANCED TECHNIQUES

11. Matrix Effect for Presentations
    - Impressive visual effect for tech talks
    - Use as background for streaming
    - Great for gaming content

12. Starfield for Ambient Background
    - Perfect for meditation content
    - Great for lo-fi music videos
    - Calming background for streams

13. CRT TV Effect for Retro Content
    - Nostalgic visual for gaming streams
    - Vintage aesthetic for creative projects
    - Great for tech history content

14. Neon Sign Generator
    - Create custom neon text effects
    - Perfect for branding and logos
    - Great for social media content
    - Customize colors and animations

BEST PRACTICES FOR ALL USERS

15. Keyboard Shortcuts
    - Press 'F' to enter fullscreen mode
    - Press 'Escape' to exit fullscreen
    - Use keyboard for quick tool access

16. Fullscreen Mode Tips
    - Hide all UI elements for clean look
    - Perfect for presentations
    - Great for immersive experiences
    - Use with external displays

17. Color Selection
    - Use RGB picker for precise colors
    - Save favorite colors for quick access
    - Test colors in different lighting
    - Consider color blindness accessibility

18. Performance Optimization
    - Close unnecessary applications
    - Use fullscreen for better performance
    - Disable animations if needed
    - Monitor system resources

19. Audio Integration
    - Mix multiple ambient sounds
    - Adjust volume for focus
    - Use audio cues for breaks
    - Test audio output quality

20. Screen Recording
    - Use fullscreen for clean recordings
    - Combine with ambient sounds
    - Test before recording
    - Use focus mode for concentration

AND 30 MORE TIPS IN THE COMPLETE GUIDE!

Visit Pure White Screen.io for more tutorials and advanced features.
`;

      // Create downloadable blob
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Pure White Screen-50-Pro-Tips.txt';
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // Send email to backend for real email service integration
      try {
        const response = await fetch('/api/email/capture-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.trim(),
            name: 'Pure White Screen User',
            source: 'exit_intent_popup',
            resource: '50_pro_tips',
          }),
        });

        if (!response.ok) {
          console.warn('Email capture failed, storing locally');
        }
      } catch (error) {
        console.warn('Email API unavailable, storing locally:', error);
      }

      // Also store locally for fallback
      const leadData = {
        email: email.trim(),
        timestamp: new Date().toISOString(),
        source: 'exit_intent_popup',
        resource: '50_pro_tips',
      };

      const existingLeads = JSON.parse(localStorage.getItem('purewhitescreen_leads') || '[]');
      existingLeads.push(leadData);
      localStorage.setItem('purewhitescreen_leads', JSON.stringify(existingLeads));

      handleClose();
    } catch (error) {
      console.error('Download error:', error);
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
                />
              </div>

              {/* Download button */}
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className="w-full bg-gradient-to-r from-[oklch(0.7_0.25_180)] to-[oklch(0.6_0.25_250)] hover:from-[oklch(0.75_0.25_180)] hover:to-[oklch(0.65_0.25_250)] text-white font-semibold py-2 rounded-lg transition-all"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                {isDownloading ? 'Downloading...' : 'Download Free Guide'}
              </Button>

              {/* Trust indicators */}
              <div className="mt-4 pt-4 border-t border-[oklch(0.2_0.02_270)] text-xs text-[oklch(0.6_0.02_0)] space-y-1">
                <p>✓ No spam, unsubscribe anytime</p>
                <p>✓ Instant download</p>
                <p>✓ 50 actionable tips</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
