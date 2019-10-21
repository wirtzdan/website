import React from "react";

function Container({ children, ...props }) {
  return (
    <div className={`max-w-4xl mx-auto px-6 md:px-8 ${props.className}`}>
      {children}
    </div>
  );
}

export default Container;
