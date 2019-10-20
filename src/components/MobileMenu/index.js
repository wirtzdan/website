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
      class="flex flex-col h-100 fixed inset-x-0 inset-y-0 lg:hidden block overflow-y-auto"
    >
      <Navigation isOpen={isOpen} links={links} />
      <BottomBar toggle={() => toggleOpen()} />
    </motion.div>
  );
}
export default MobileMenu;
