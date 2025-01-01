import { AnimatePresence, motion } from "framer-motion";
import { Ellipsis } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0, y: 15 }}
        className="text-center flex items-center"
      >
        <Ellipsis className=" h-12 w-12 mx-auto animate-pulse text-primary" />
      </motion.div>
    </AnimatePresence>
  );
};

export default Loading;
