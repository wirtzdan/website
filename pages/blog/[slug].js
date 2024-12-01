import BlogLayout from "@/layouts/blog";
import readingTime from "reading-time";
import { getBlogPosts, getPageByPageId } from "@/lib/notion/api";
import NotionPage from "@/components/notion-page";
import dayjs from "dayjs";

export default function Blog({ post, postRecordMap }) {
  return (
    <BlogLayout post={post}>
      <NotionPage recordMap={postRecordMap} />
    </BlogLayout>
  );
}

export const getStaticPaths = async () => {
  const posts = await getBlogPosts({ pageSize: 9999 });
  return {
    paths: posts.results.map((p) => {
      const publishYear = dayjs(p.publishDate).format("YYYY");
      return {
        params: { slug: p.slug, year: publishYear },
      };
    }),
    fallback: "blocking",
  };
};

export const getStaticProps = async ({ params }) => {
  const { slug } = params;
  const posts = await getBlogPosts({ pageSize: 9999 });
  const post = posts.results.find((p) => p.slug === slug);

  if (!post) {
    return {
      props: {
        post: null,
        postRecordMap: null,
      },
      revalidate: 10,
    };
  }

  const postPage = await getPageByPageId(post.id);

  return {
    props: {
      post: {
        ...post,
        socialImage: post.socialImage || null,
      },
      postRecordMap: postPage,
    },
    revalidate: 10,
  };
};
