import React, { useEffect } from "react";
import { Mail } from "react-feather";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";
import { Link } from "gatsby";

function BottomBar({ toggle }) {
  return (
    <div className="z-50 flex items-center justify-around h-16 mt-auto bg-white border-t-2 shadow-xl border-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 ">
      <Link to="/subscribe/" className="flex justify-center w-1/3">
        <Mail className="w-auto h-6" />
      </Link>
      <MenuToggle toggle={toggle} />
      <div className="flex justify-center w-1/3">
        <ThemeToggle />
      </div>
    </div>
  );
}
export default BottomBar;
