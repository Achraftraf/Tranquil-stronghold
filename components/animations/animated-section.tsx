"use client";

import React from "react";
import { motion, useInView } from "framer-motion";

interface AnimatedSectionProps {
  children: React.ReactNode;
  classNames?: string;
  delay?: number;
  id?: string;
}

export const AnimatedSection = ({
  children,
  classNames = "",
  id="#",
  delay = 0,
}: AnimatedSectionProps) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      id={id}
      className={classNames}
      initial={{ opacity: 0, y: 80 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7 }}
    >
      {children}
    </motion.div>
  );
};




export const AnimatedSectionH = ({ children, classNames, delay }: AnimatedSectionProps) => {
  return (
    <motion.div
      className={classNames}
      initial={{ opacity: 0, translateY: 80 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ duration: 0.7 }}
    >
      {children}
    </motion.div>
  )
}

