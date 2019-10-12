import { Link } from "gatsby";
import React, { useState, useEffect } from "react";
import { ThemeToggle } from "./index";
import { Menu, Mail } from "react-feather";

function MDHeader() {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  useEffect(() => console.log(menuIsOpen), [menuIsOpen]);

  return (
    <header
      class={`flex flex-col h-100 fixed inset-x-0 inset-y-0 lg:hidden block overflow-y-auto ${
        menuIsOpen ? "" : "h-16 mt-auto"
      }`}
    >
      <div
        class={`flex-grow bg-gray-200 dark:bg-gray-800 ${
          menuIsOpen ? "" : "hidden"
        }`}
      >
        <nav class="flex flex-col items-center justify-center h-full">
          {[
            {
              route: `/`,
              title: `Home`
            },
            {
              route: `/reading`,
              title: `Reading`
            }
          ].map(link => (
            <Link
              className="text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark-hover:bg-gray-800 rounded px-4 py-2 mr-2"
              key={link.title}
              to={link.route}
              activeClassName="font-semibold text-green-500 dark:text-green-500"
            >
              {link.title}
            </Link>
          ))}
        </nav>
      </div>
      <div class="flex justify-around items-center h-16 border-t-2 bg-gray-200 border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-xl mt-auto">
        <Mail class="h-8 w-auto" />
        <Menu onClick={() => setMenuIsOpen(open => !open)} class="h-8 w-auto" />
        <ThemeToggle />
      </div>
    </header>
  );
}
export default MDHeader;
