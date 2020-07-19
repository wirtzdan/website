import React from "react";

import { Layout, SEO, Section, Tag } from "../components/common";
import interests from "../../content/data/interests.json";
import Portrait from "../../content/assets/daniel-wirtz.jpg";

function AboutPage() {
  return (
    <Layout>
      <SEO keywords={[]} title="About" />
      <Section>
        <h1>About Me</h1>
        <div className="flex flex-wrap">
          <p className="md:pr-12 measure md:w-3/4">
            After school, I studied Media and Communications for Digital
            Business in Aachen, Germany. It was at that time, where I found my
            passion for Design, Technology and being an Entrepreneur. In my free
            time, I always liked to follow my curiosity, learn new things and
            explore the far corners of the internet. Currently, I'm spending my
            day on <a href="https://crisp.studio/">Crisp Studio</a> while
            dedicating my evenings read books, write articles, code things and
            spend time with my favorite people in life.
          </p>
          <img class="h-full md:w-1/4 w-3/4 rounded-lg shadow" src={Portrait} />
        </div>
      </Section>
      <Section>
        <h2>Work</h2>
        <p>
          Two semesters into university I co-founded a company called{" "}
          <a href="https://crisp.studio/">Crisp Studio</a> with my good friend
          René Nauheimer. Over time, the company evolved into a small,
          specialised studio that helps organisations to solve important
          challenges with Sprints and Workshops. In my role, I'm focused on
          strategy, healthy growth and charming clients (I try my best). The
          journey of building this company from the ground up has been one of
          the most satisfying experiences in my life. Head over to my{" "}
          <a href="https://www.linkedin.com/in/wirtzdan/"> LinkedIn</a>, if you
          want to connect with my professionally.
        </p>
      </Section>
      <Section>
        <h2 className="block">😁</h2>
        <div className="-my-2">
          {interests.like.map((el) => (
            <Tag text={el} />
          ))}
        </div>
      </Section>
      <Section extend="mb-10">
        <h2 className="block">☹️</h2>
        <div className="-my-2">
          {interests.dislike.map((el) => (
            <Tag text={el} />
          ))}
        </div>
      </Section>
    </Layout>
  );
}

export default AboutPage;
