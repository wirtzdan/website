import React from "react";
import { motion } from "framer-motion";

function Book(props) {
  return (
    <div class="md:w-1/4 p-3 w-1/2">
      <a href={props.link} class="w-full h-full">
        <motion.img
          whileHover={{ scale: 1.015, rotate: 2 }}
          class="rounded-lg shadow-md hover:shadow-lg w-full h-full object-cover"
          src={props.imageUrl}
        ></motion.img>
      </a>
    </div>
  );
}

export default Book;
