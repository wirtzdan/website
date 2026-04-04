import { SimpleGrid, VStack } from "@chakra-ui/react";
import type { GetStaticProps, InferGetStaticPropsType } from "next";

import BookmarkCard from "@/components/bookmark-card";
import Hero from "@/components/hero";
import Layout from "@/layouts/layout";
import Section from "@/components/section";
import type { BookmarkResponse } from "@/types/content";

const BookmarksPage = ({
  bookmarks,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <VStack spacing={8}>
        <Hero title="Bookmarks" subtitle="Discoveries from the World Wide Web" />
        <Section>
          <SimpleGrid columns={[2, 3]} spacing={4}>
            {bookmarks.items.map((bookmark) => (
              <BookmarkCard
                key={`${bookmark.link}-${bookmark.created}`}
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
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<{
  bookmarks: BookmarkResponse;
}> = async () => {
  const url =
    'https://api.raindrop.io/rest/v1/raindrops/0?search=[{"key":"important","val":"true"}]&sort="-created"&perpage=30';

  const response = await fetch(url, {
    method: "GET",
    headers: new Headers({
      Authorization: `Bearer ${process.env.RAINDROP_ACCESS_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    }),
  });

  const bookmarks = (await response.json()) as BookmarkResponse | null;

  if (!bookmarks) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      bookmarks: {
        items: [...bookmarks.items].sort(
          (left, right) =>
            new Date(right.created).getTime() - new Date(left.created).getTime()
        ),
      },
    },
    revalidate: 10,
  };
};

export default BookmarksPage;
