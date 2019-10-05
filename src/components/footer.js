import React from "react";

function Header() {
  return (
    <footer className="bg-gray-900">
      <nav className="flex justify-between max-w-4xl mx-auto p-4 md:p-8 text-sm">
        <p className="text-white">
          <a className="font-bold no-underline text-white" href="#">
            Imprint
          </a>
        </p>

        <p>
          <a
            className="font-bold no-underline text-white"
            href="https://github.com/wirtzdan"
          >
            GitHub
          </a>
        </p>
      </nav>
    </footer>
  );
}

export default Header;
