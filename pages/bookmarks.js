import React from "react";
import { VStack, SimpleGrid } from "@chakra-ui/react";
import PageTransition from "../components/page-transitions";
import Section from "@/components/section";
import sorter from "sort-isostring";
import Hero from "@/components/hero";

import BookmarkCard from "../components/bookmark-card";

const Bookmarks = ({ bookmarks }) => {
  return (
    <PageTransition>
      <VStack spacing={8}>
        <Hero
          title="Bookmarks"
          subtitle="Discoveries from the World Wide Web"
        />
        <Section>
          <SimpleGrid columns={[2, 3]} spacing={4}>
            {bookmarks.items
              .sort((x, y) => sorter(y.created, x.created))
              .map((bookmark) => (
                <BookmarkCard
                  key={bookmark.title}
                  title={bookmark.title}
                  cover={bookmark.cover}
                  created={bookmark.created}
                  excerpt={bookmark.excerpt}
                  type={bookmark.type}
                  link={bookmark.link}
                />
              ))}
          </SimpleGrid>
        </Section>
      </VStack>
    </PageTransition>
  );
};

export async function getStaticProps() {
  const url = `https://api.raindrop.io/rest/v1/raindrops/0?search=[{"key":"important","val":"true"}]&sort="-created"&perpage=30`;

  const res = await fetch(url, {
    method: "get",
    headers: new Headers({
      Authorization: `Bearer ${process.env.RAINDROP_ACCESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  });

  const bookmarks = await res.json();

  if (!bookmarks) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bookmarks,
    },
    revalidate: 10,
  };
  s;
}

export default Bookmarks;
