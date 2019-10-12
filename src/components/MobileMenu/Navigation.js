import React from "react";
import MenuItem from "./MenuItem";
import { motion } from "framer-motion";

const variants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  },
  closed: {
    opacity: 0,
    y: "50",
    transition: {
      staggerChildren: 0.1,
      staggerDirection: -1
    }
  }
};

function Navigation({ links, isOpen }) {
  return (
    <div class="flex-grow">
      <motion.nav
        class="flex-grow bg-gray-200 dark:bg-gray-800 flex flex-col items-center justify-center h-full"
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
