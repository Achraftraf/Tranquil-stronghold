"use client"

import { motion } from 'framer-motion';
import React from 'react';

interface Props {
  classNames: string;
  children: React.ReactNode;
}

const AnimatedBox: React.FC<Props> = ({
  classNames,
  children
}) => {
  return (
    <motion.header
      className={classNames}
      initial={{ opacity: 0, translateY: 50 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.header>
  );
};

export default AnimatedBox;

