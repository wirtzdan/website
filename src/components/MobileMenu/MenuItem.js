import React from "react";
import { Link } from "gatsby";
import { motion } from "framer-motion";

const variants = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 20,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

function MenuItem({ to, title }) {
  return (
    <Link
      className="px-4 py-2 mr-2 text-3xl no-select"
      to={to}
      activeClassName="font-semibold"
    >
      <motion.div variants={variants}>{title}</motion.div>
    </Link>
  );
}
export default MenuItem;
