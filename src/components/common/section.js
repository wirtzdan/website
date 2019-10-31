import React from "react";
import Container from "./container";

function Section({ children, ...props }) {
  return (
    <section className="mt-10">
      <Container {...props}>{children}</Container>
    </section>
  );
}

export default Section;
