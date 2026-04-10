'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10 rounded-xl"
        disabled
      >
        <div className="w-5 h-5" />
      </Button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 dark:from-accent/20 dark:to-primary/20 dark:hover:from-accent/30 dark:hover:to-primary/30 border border-border transition-all duration-300 overflow-hidden group"
      aria-label="Toggle theme"
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-20 dark:group-hover:opacity-30 transition-opacity duration-300" />
      
      {/* Icons with animation */}
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          rotate: isDark ? 180 : 0,
          opacity: isDark ? 0 : 1,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Sun className="w-5 h-5 text-primary dark:text-accent" />
      </motion.div>
      
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          rotate: isDark ? 0 : -180,
          opacity: isDark ? 1 : 0,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <Moon className="w-5 h-5 text-accent dark:text-primary" />
      </motion.div>
    </Button>
  );
}