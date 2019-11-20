import React from "react";
import { motion } from "framer-motion";

function Book(props) {
  return (
    <div className="relative md:w-1/4 my-2 px-2 w-1/2">
      <div class="ml-2 book-fold absolute w-4 inset-y-0 left-0 z-10"></div>
      <a href={props.link} className="w-full h-full relative">
        <img
          whileHover={{ scale: 1.015, rotate: 2 }}
          className="rounded-sm rounded-r-lg shadow-lg hover:shadow-lg w-full h-full object-cover"
          src={props.imageUrl}
        ></img>
      </a>
    </div>
  );
}

export default Book;
