import { Link } from "gatsby";
import React from "react";
import { Section } from "../common";
import ThemeToggle from "./ThemeToggle";

function MDHeader() {
  return (
    <header className="hidden lg:block">
      <Section>
        <div className="mt-10">
          <Link to="/">
            <span className="text-4xl font-bold">Daniel Wirtz</span>
          </Link>
        </div>
        <div className="flex items-center justify-between pb-6 my-6 border-b-2 border-primary-400">
          <nav className="-ml-4">
            {[
              {
                route: `/`,
                title: `Home`,
              },
              {
                route: `/about`,
                title: `About`,
              },
              {
                route: `/blog`,
                title: `Blog`,
              },
              {
                route: `/books`,
                title: `Books`,
              },
            ].map((link) => (
              <Link
                className="px-4 py-2 mr-2 text-2xl rounded hover:bg-neutral-100 dark-hover:bg-neutral-800"
                key={link.title}
                to={link.route}
                activeClassName="font-semibold"
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </Section>
    </header>
  );
}

export default MDHeader;
