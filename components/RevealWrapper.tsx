'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealWrapperProps {
  children: ReactNode;
  duration?: number;
  origin?: 'top' | 'bottom' | 'left' | 'right';
}

export function RevealWrapper({ 
  children, 
  duration = 1000, 
  origin = 'bottom'
}: RevealWrapperProps) {
  const directions = {
    top: { y: -50 },
    bottom: { y: 50 },
    left: { x: -50 },
    right: { x: 50 },
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...directions[origin] 
      }}
      whileInView={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ 
        duration: duration / 1000,
        ease: 'easeOut'
      }}
    >
      {children}
    </motion.div>
  );
}
