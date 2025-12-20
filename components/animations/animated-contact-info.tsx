"use client"

import { motion } from 'framer-motion';
import React from 'react';

const AnimatedContactInfo = ({ children, classNames }: { children: React.ReactNode, classNames?: string }) => {
  return (
    <motion.div
      className={classNames}
      initial={{ width: '0%', opacity: 0, x: -20 }}
      animate={{ width: '100%', opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

const AnimatedContactInfoItem = ({ children, delay }: { children: React.ReactNode, delay: number }) => {
  return (
    <motion.div
      className="text-start"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}

    >{children}</motion.div>
  );
}
export { AnimatedContactInfo, AnimatedContactInfoItem };

