import React from "react";

function Button({ text, icon, to }) {
  return (
    <a
      href={to}
      class="inline-flex items-center py-3 px-6 rounded-lg bg-primary-400 font-bold text-xl text-white"
    >
      <div class="mr-2 h-6 w-6">{icon}</div>
      {text}
    </a>
  );
}

export default Button;
