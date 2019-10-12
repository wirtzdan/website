import React from "react";
import { Link } from "gatsby";
import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    rotateZ: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: -50,
    rotateZ: 10,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

function MenuItem({ to, title }) {
  return (
    <Link
      className="text-3xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark-hover:bg-gray-800 rounded px-4 py-2 mr-2"
      to={to}
      activeClassName="font-semibold text-green-500 dark:text-green-500"
    >
      <motion.div variants={variants}>{title}</motion.div>
    </Link>
  );
}
export default MenuItem;
