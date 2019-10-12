import React from "react";
import { Menu, Mail } from "react-feather";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";

function BottomBar({ toggle }) {
  return (
    <div class="flex justify-around items-center h-16 border-t-2 bg-gray-200 border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-xl mt-auto">
      <div class="w-1/3 flex justify-center">
        <Mail class="h-6 w-auto" />
      </div>
      <MenuToggle toggle={toggle} />
      <ThemeToggle />
    </div>
  );
}
export default BottomBar;
