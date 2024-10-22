"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function LayoutProvider({ children }: { children: A }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ delay: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default LayoutProvider;
