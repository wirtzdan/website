import { graphql, useStaticQuery, Link } from "gatsby";
import React, { useState } from "react";
import { Container, ThemeToggle } from "./index";

function Header() {
  return (
    <header class="">
      <Container class="border-b-2 dark:border-gray-800">
        <div class="mt-10">
          <Link to="/">
            <span class="text-4xl font-medium">Daniel Wirtz</span>
          </Link>
        </div>
        <div class="flex justify-between items-center my-6 -ml-4">
          <nav>
            {[
              {
                route: `/`,
                title: `Home`
              },
              {
                route: `/reading`,
                title: `Reading`
              }
            ].map(link => (
              <Link
                className="text-2xl text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark-hover:bg-gray-800 rounded px-4 py-2 mr-2"
                key={link.title}
                to={link.route}
                activeClassName="font-semibold text-green-500 dark:text-green-500"
              >
                {link.title}
              </Link>
            ))}
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}

export default Header;
