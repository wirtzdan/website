import React from "react";

import { Layout, SEO, Section, Tag } from "../components/common";
import interests from "../../content/data/interests.json";
import Portrait from "../../content/assets/daniel-wirtz.jpg";

function AboutPage() {
  return (
    <Layout>
      <SEO
        keywords={[`gatsby`, `tailwind`, `react`, `tailwindcss`]}
        title="Home"
      />
      <Section>
        <h1>About Me</h1>
        <div className="flex flex-wrap">
          <p className="measure md:w-3/4 pr-12">
            I'm a curious mind with many interests. I like to immerse myself
            into one topic, but quickly jump to the next when I get bored.
            Learning gives me the most satisfaction and is a common pattern in
            my life. I studied Media and Communications for Digital Business
            (Heck, that's long...) in Aachen and still, live there today.
          </p>
          <img
            class="md:h-full md:w-1/4 w-3/4 rounded-lg shadow"
            src={Portrait}
          />
        </div>
      </Section>
      <Section>
        <h2>Work</h2>
        <p className="measure">
          Back in university, I co-founded a company called{" "}
          <a href="https://crisp.studio">Crisp Studio</a>. Over time the company
          evolved into a small, expert studio for Design Sprints. In my role as
          a CEO, I focus on business strategy, team-alignment and running a
          healthy company. When I'm involved in client projects I'm mostly
          designing and prototyping products.
        </p>
      </Section>
      <Section>
        <h2 className="block">😁</h2>
        <div className="-my-2">
          {interests.like.map(el => (
            <Tag text={el} />
          ))}
        </div>
      </Section>
      <Section extend="md:mb-10">
        <h2 className="block">☹️</h2>
        <div className="-my-2">
          {interests.dislike.map(el => (
            <Tag text={el} />
          ))}
        </div>
      </Section>
    </Layout>
  );
}

export default AboutPage;
