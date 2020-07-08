import React from "react";
import { useCycle } from "framer-motion";
import Navigation from "./Navigation";
import BottomBar from "./BottomBar";
import { motion } from "framer-motion";

function MobileMenu() {
  const [isOpen, toggleOpen] = useCycle(false, true);

  const links = [
    {
      route: `/`,
      title: `Home`,
    },
    {
      route: `/about`,
      title: `About`,
    },
    {
      route: `/reading`,
      title: `Reading`,
    },
    {
      route: `/blog`,
      title: `Blog`,
    },
  ];

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="fixed inset-x-0 bottom-0 flex flex-col block lg:hidden"
    >
      <Navigation isOpen={isOpen} links={links} />
      <BottomBar toggle={() => toggleOpen()} />
    </motion.div>
  );
}
export default MobileMenu;
