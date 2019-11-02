import React from "react";
import { Mail } from "react-feather";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";

function BottomBar({ toggle }) {
  return (
    <div className="flex justify-around items-center h-16 border-t-2 shadow-xl bg-white border-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 shadow-xl mt-auto z-50 ">
      <a
        href="mailto:hello@danielwirtz.com"
        className="w-1/3 flex justify-center"
      >
        <Mail className="h-6 w-auto" />
      </a>
      <MenuToggle toggle={toggle} />
      <div className="w-1/3 flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
export default BottomBar;
