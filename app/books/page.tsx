import BooksPage from "@/components/route-content/books-page";
import Layout from "@/layouts/layout";
import { getTable, type BookFields } from "@/lib/airtable";
import { booksMetadata } from "@/lib/page-metadata";

export const metadata = booksMetadata;

export const revalidate = 10;

export default async function Page() {
  const books = await getTable<BookFields>("Books");

  return (
    <Layout>
      <BooksPage books={books} />
    </Layout>
  );
}
