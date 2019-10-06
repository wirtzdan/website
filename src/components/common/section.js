import React from "react";
import Container from "./container";

function Section({ children, ...props }) {
  return (
    <section class="my-10" {...props}>
      <Container>{children}</Container>
    </section>
  );
}

export default Section;
