import * as React from "react";
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

const Path = (props) => (
  <motion.path strokeWidth="2" strokeLinecap="round" {...props} />
);

function MenuToggle({ toggle }) {
  return (
    <Box onClick={toggle} zIndex="50">
      <svg stroke="currentColor" width="23" height="23" viewBox="0 0 23 23">
        <Path
          variants={{
            closed: { d: "M 2 2.5 L 20 2.5" },
            open: { d: "M 3 16.5 L 17 2.5" },
          }}
        />

        <Path
          variants={{
            closed: { d: "M 2 16.346 L 20 16.346" },
            open: { d: "M 3 2.5 L 17 16.346" },
          }}
        />
      </svg>
    </Box>
  );
}

export default MenuToggle;
