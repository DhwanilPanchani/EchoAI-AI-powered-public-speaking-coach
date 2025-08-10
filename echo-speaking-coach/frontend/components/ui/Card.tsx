'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'default' | 'glass' | 'gradient';
}

export default function Card({ 
  className, 
  variant = 'default', 
  children, 
  ...props 
}: CardProps) {
  const variants = {
    default: 'bg-gray-800 border-gray-700',
    glass: 'bg-white/10 backdrop-blur-md border-white/20',
    gradient: 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-700/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn(
        'rounded-xl border p-6 transition-all duration-200',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}