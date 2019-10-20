import React from "react";
import { Menu, Mail } from "react-feather";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";

function BottomBar({ toggle }) {
  return (
    <div class="flex justify-around items-center h-16 border-t-2 shadow-xl bg-white border-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 shadow-xl mt-auto ">
      <div class="w-1/3 flex justify-center">
        <Mail class="h-6 w-auto" />
      </div>
      <MenuToggle toggle={toggle} />
      <div class="w-1/3 flex justify-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
export default BottomBar;
