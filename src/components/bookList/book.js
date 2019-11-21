import React from "react";
import { motion } from "framer-motion";

function Book(props) {
  return (
    <motion.div
      whileHover={{ scale: 1.015, rotate: 2 }}
      className="md:w-1/4 my-5 px-5 w-1/2 "
    >
      {/* <div class="inset-y-0 left-0 w-4 ml-5 book-fold"></div> */}
      <a href={props.link} className="w-full h-full">
        <img
          className="rounded-sm rounded-r-lg shadow-md hover:shadow-lg w-full h-full object-cover"
          src={props.imageUrl}
        ></img>
      </a>
    </motion.div>
  );
}

export default Book;
