import React, { useEffect } from "react";
import { Mail } from "react-feather";
import ThemeToggle from "./ThemeToggle";
import MenuToggle from "./MenuToggle";

function BottomBar({ toggle }) {
  // useEffect(() => {
  //   const script = document.createElement(`script`);
  //   script.async = true;
  //   script.setAttribute(`data-uid`, `90ebbd817c`);
  //   script.src = `https://daniels-newsletter.ck.page/17b2acc0f1/index.js`;
  //   document.body.appendChild(script);
  // }, []);

  return (
    <div className="z-50 flex items-center justify-around h-16 mt-auto bg-white border-t-2 shadow-xl border-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 ">
      <a
        href="mailto:danielwirtzx@gmail.com"
        className="flex justify-center w-1/3"
      >
        <Mail className="w-auto h-6" />
      </a>
      <MenuToggle toggle={toggle} />
      <div className="flex justify-center w-1/3">
        <ThemeToggle />
      </div>
    </div>
  );
}
export default BottomBar;
