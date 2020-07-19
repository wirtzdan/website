import React, { useEffect } from "react";

import { Layout, SEO, Section } from "../components/common";

function ReadingPage() {
  useEffect(() => {
    const script = document.createElement(`script`);
    script.async = true;
    script.setAttribute(`data-uid`, `97cd6c776a`);
    script.src = `https://daniels-newsletter.ck.page/97cd6c776a/index.js`;
    document.getElementById("newsletter").appendChild(script);
  }, []);

  return (
    <Layout>
      <SEO keywords={[]} title="Subscribe" />
      <Section>
        <h1>Subscribe to my desk</h1>
        <p className="text-2xl measure">
          Hey there! This newsletter is my way of sharing what I think, write
          and learn with a small group of interesting people. Straight from my
          desk to yours. Send, whenever I have something interesting to show
          you.
        </p>
        <div id="newsletter"></div>
      </Section>
    </Layout>
  );
}

export default ReadingPage;
