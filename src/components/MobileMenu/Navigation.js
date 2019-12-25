import React from "react";
import MenuItem from "./MenuItem";
import { Link } from "gatsby";
import { motion, AnimatePresence } from "framer-motion";

const menuvariants = {
  open: {
    opacity: 1
  },
  closed: {
    opacity: 0
  }
};

const navvariants = {
  open: {
    transition: { staggerChildren: 0.15, delayChildren: 0.25 }
  },
  closed: {}
};

function Navigation({ links, isOpen }) {
  return (
    <div
      className={`fixed top-0 bottom-16 inset-x-0 ${
        isOpen ? "" : "pointer-events-none"
      }`}
    >
      <motion.div
        className="relative flex flex-col items-center justify-center w-full h-full p-4 bg-neutral-100 dark:bg-neutral-700"
        variants={menuvariants}
      >
        <motion.nav
          className={`flex flex-col justify-center items-center ${
            isOpen ? "" : "pointer-events-none"
          }`}
          variants={navvariants}
        >
          {links.map(link => (
            <MenuItem key={link.title} to={link.route} title={link.title} />
          ))}
        </motion.nav>
        <div className="absolute bottom-0 right-0 flex justify-between w-full px-8 mb-8">
          <Link to="/imprint" className="text-base opacity-25 hover:opacity-75">
            Imprint
          </Link>
          <Link
            to="/privacy"
            className="text-base opacity-25 hover:opacity-75 "
          >
            Privacy
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default Navigation;
