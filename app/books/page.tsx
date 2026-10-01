import BooksPage from "@/components/route-content/books-page";
import Layout from "@/layouts/layout";
import { booksMetadata } from "@/lib/page-metadata";
import { getBooks } from "@/lib/notion/api";

export const metadata = booksMetadata;

export const revalidate = 10;

export default async function Page() {
  const books = await getBooks();

  return (
    <Layout>
      <BooksPage books={books} />
    </Layout>
  );
}
