'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((state) => state.settings?.theme || 'dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    console.log('ThemeProvider - mounted:', mounted, 'theme:', theme);
    
    if (mounted && theme) {
      console.log('Applying theme:', theme);
      // Remove both classes from html element
      document.documentElement.classList.remove('light', 'dark');
      
      // Add the current theme class to html element
      document.documentElement.classList.add(theme);
      
      // Update CSS variables
      if (theme === 'dark') {
        document.documentElement.style.setProperty('--background', '#0a0a0a');
        document.documentElement.style.setProperty('--foreground', '#ededed');
      } else {
        document.documentElement.style.setProperty('--background', '#ffffff');
        document.documentElement.style.setProperty('--foreground', '#171717');
      }
    }
  }, [theme, mounted]);

  // Apply default theme immediately on mount to prevent white screen
  useEffect(() => {
    if (!mounted) {
      console.log('Applying default dark theme');
      document.documentElement.classList.add('dark');
    }
  }, [mounted]);

  return <>{children}</>;
}