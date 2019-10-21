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
    },
    height: "auto"
  },
  closed: {
    y: -50,
    rotateZ: 10,
    opacity: 0.5,
    transition: {
      y: { stiffness: 1000 }
    },
    height: 0
  }
};

function MenuItem({ to, title }) {
  return (
    <Link
      className="text-3xl px-4 py-2 mr-2"
      to={to}
      activeclassName="font-semibold text-primary-400"
    >
      <motion.div variants={variants}>{title}</motion.div>
    </Link>
  );
}
export default MenuItem;
