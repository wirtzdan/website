import React from "react";
import { Link } from "gatsby";
import { Section } from "./index";

function Footer() {
  const date = new Date().getFullYear();

  return (
    <Section extend="mb-10 lg:block hidden">
      <footer className="flex justify-between items-center">
        <div>
          <span className="opacity-50 text-base">© {date} Daniel Wirtz </span>
        </div>
        <div>
          <Link
            to="/imprint"
            className="opacity-50 text-base hover:opacity-100 mr-6 link-underline"
          >
            Imprint
          </Link>
          <Link
            to="/privacy"
            className="opacity-50 text-base hover:opacity-100 link-underline"
          >
            Privacy
          </Link>
        </div>
      </footer>
    </Section>
  );
}

export default Footer;
