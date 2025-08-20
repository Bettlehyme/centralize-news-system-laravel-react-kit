import React from "react";
import { motion } from "framer-motion";

interface PulsingLogoProps {
  src: string;      // logo image URL
  size?: number;    // optional size in px
}

const PulsingLogo: React.FC<PulsingLogoProps> = ({ src, size = 100 }) => {
  return (
    <motion.img
      src={src}
      alt="Logo"
      style={{ width: size}}
      className="mx-auto"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut",
      }}
    />
  );
};

export default PulsingLogo;
