import React from "react";
import { motion } from "framer-motion";

const book = {
  open: {
    scale: 1.1,
    rotate: -4,
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);"
  },
  transition: {
    staggerChildren: 0.5
  }
};

const pages = {
  open: { opacity: 1, x: 3, y: 3, rotate: 2 },
  closed: { opacity: 0 }
};

function Book(props) {
  return (
    <motion.div
      variants={book}
      initial="closed"
      whileHover="open"
      className="relative md:w-1/4 my-5 px-5 w-1/2"
    >
      <motion.div
        variants={pages}
        className="absolute inset-0 book-page-gradient rounded-sm rounded-r-lg ml-6 mr-4 shadow-sm border"
      ></motion.div>
      <a href={props.link} className="relative w-full h-full z-50">
        <img
          className="rounded-sm rounded-r-lg w-full h-full object-cover"
          src={props.imageUrl}
        ></img>
      </a>
      <div class="absolute inset-y-0 left-0 w-4 ml-5 book-fold z-50"></div>
    </motion.div>
  );
}

export default Book;
