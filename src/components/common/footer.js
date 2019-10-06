import React from "react";
import { ThemeToggle } from "./index";

function Footer() {
  return (
    <footer>
      <nav className="flex justify-between max-w-4xl mx-auto p-4 md:p-8 text-sm">
        <p className="text-white">
          <a className="font-bold no-underline text-gray-700" href="#">
            Imprint
          </a>
        </p>
        <p>
          <a
            className="font-bold no-underline text-gray-700"
            href="https://github.com/wirtzdan"
          >
            GitHub
          </a>
        </p>
        <ThemeToggle />
      </nav>
    </footer>
  );
}

export default Footer;
