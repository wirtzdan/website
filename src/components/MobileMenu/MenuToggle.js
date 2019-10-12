import * as React from "react";
import { motion } from "framer-motion";

const Path = props => (
  <motion.path strokeWidth="2" strokeLinecap="round" {...props} />
);

function MenuToggle({ toggle }) {
  return (
    <div onClick={toggle} class="focus:outline-none w-1/3 flex justify-center">
      <svg
        class="stroke-current text-gray-800 dark:text-gray-100"
        width="23"
        height="23"
        viewBox="0 0 23 23"
      >
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" }
          }}
        />

        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" }
          }}
        />
      </svg>
    </div>
  );
}

export default MenuToggle;
