import React from "react";

function Button({ text, icon, to, extend }) {
  return (
    <a
      href={to}
      className={`inline-flex items-center justify-center py-3 px-6 rounded-lg font-bold text-xl text-white h-full ${extend} `}
    >
      <div className={icon ? `mr-2 h-6 w-6` : ""}>{icon}</div>
      {text}
    </a>
  );
}

export default Button;
