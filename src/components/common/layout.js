import PropTypes from "prop-types";
import React from "react";

import { MDHeader, Header } from "../navigation";

function Layout({ children }) {
  return (
    <div className="flex flex-col font-sans min-h-screen text-gray-800 dark:text-gray-200 antialiased bg-gray-100 dark:bg-gray-900">
      <Header />
      <MDHeader />
      <main className="flex flex-col flex-1 md:justify-center mx-auto w-full">
        {children}
      </main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired
};

export default Layout;
