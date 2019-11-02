import React from "react";
import MenuItem from "./MenuItem";
import { motion, AnimatePresence } from "framer-motion";

const variants = {
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.25 }
  },
  closed: {
    opacity: 0
  }
};

function Navigation({ links, isOpen }) {
  return (
    <div
      className={`fixed top-0 bottom-16 inset-x-0 ${
        isOpen ? "" : "pointer-events-none"
      }`}
    >
      <motion.nav
        className={`flex-grow bg-neutral-100 dark:bg-neutral-700 flex flex-col items-center justify-center h-full ${
          isOpen ? "" : "pointer-events-none"
        }`}
        variants={variants}
      >
        {links.map(link => (
          <MenuItem key={link.title} to={link.route} title={link.title} />
        ))}
      </motion.nav>
    </div>
  );
}

export default Navigation;
