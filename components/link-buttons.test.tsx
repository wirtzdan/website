import { expect, test } from "vite-plus/test";

import { ChakraProvider } from "@chakra-ui/react";
import { renderToStaticMarkup } from "react-dom/server";

import Footer from "@/components/footer";
import HomePage from "@/components/route-content/home-page";
import theme from "@/theme";

const render = (node: React.ReactNode) =>
  renderToStaticMarkup(<ChakraProvider value={theme}>{node}</ChakraProvider>);

const anchors = (html: string) => html.match(/<a\b[^>]*>/g) ?? [];

// Chakra's Button sets type="button" and asChild copies it onto the link,
// which is invalid on <a>. Link buttons pass type={undefined} to drop it.
test("link buttons don't render type on <a>", () => {
  const html = render(
    <>
      <HomePage posts={{ results: [] } as never} />
      <Footer />
    </>,
  );
  expect(anchors(html).length).toBeGreaterThan(5);
  expect(anchors(html).filter((tag) => /\stype=/.test(tag))).toEqual([]);
});

test("home links have descriptive visible text", () => {
  const html = render(<HomePage posts={{ results: [] } as never} />);
  expect(html).toMatch(/href="\/about"[^>]*>More about me/);
  expect(html).toMatch(/href="\/blog"[^>]*>All posts/);
  expect(html).not.toMatch(/>\s*(Read more|View all)\s*</);
  expect(html).not.toContain('aria-label="Read more about me"');
});
