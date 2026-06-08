import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, X } from 'lucide-react';
import { Link } from 'wouter';

export function StickyCtaBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      // Show sticky CTA after scrolling past hero (around 600px)
      setIsVisible(currentScrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/white-screen">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-shadow"
            >
              <Button className="bg-transparent text-white font-bold px-6 py-3 text-lg hover:bg-transparent">
                <Zap className="w-5 h-5 mr-2" />
                Launch App
              </Button>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ExitIntentPopup disabled - removed per user request
export function ExitIntentPopup() {
  return null;
}
