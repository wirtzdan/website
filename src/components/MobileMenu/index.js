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
      title: `Home`
    },
    {
      route: `/about`,
      title: `About`
    },
    {
      route: `/reading`,
      title: `Reading`
    },
    {
      route: `/writing`,
      title: `Writing`
    }
  ];

  return (
    <motion.div
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className="flex flex-col fixed inset-x-0 bottom-0 lg:hidden block"
    >
      <Navigation isOpen={isOpen} links={links} />
      <BottomBar toggle={() => toggleOpen()} />
    </motion.div>
  );
}
export default MobileMenu;
