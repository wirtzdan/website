import React from "react";

function Container({ children, ...props }) {
  return (
    <div class={`max-w-4xl mx-auto px-6 md:px-8 ${props.class}`}>
      {children}
    </div>
  );
}

export default Container;
