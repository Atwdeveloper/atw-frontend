// src/components/AnimatedPage.jsx
import React from "react";
import { motion } from "framer-motion";
import { motionVariants } from "../utils/motionVariants";

export const AnimatedPage = ({ type = "dashboard", children, className = "" }) => {
  const variants = motionVariants[type] || motionVariants.form;

  return (
    <motion.div
      variants={variants.container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, {
              as: motion.div, 
              variants: variants.item,
            })
          : child
      )}
    </motion.div>
  );
};
