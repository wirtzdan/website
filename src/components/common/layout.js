import PropTypes from "prop-types";
import React from "react";
import { AnimatePresence } from "framer-motion";
import Header from "../MobileMenu/header";
import MDHeader from "../MobileMenu";

function Layout({ children }) {
  return (
    <div className="flex flex-col font-body min-h-screen text-neutral-700 dark:text-neutral-100 antialiased bg-neutral-50 dark:bg-neutral-900">
      <Header />
      <MDHeader />
      <main className="flex flex-col flex-1 mx-auto w-full">{children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
