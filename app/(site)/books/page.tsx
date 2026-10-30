import BooksPage from "@/components/route-content/books-page";
import { booksMetadata } from "@/lib/page-metadata";
import { getBooks } from "@/lib/notion/api";

export const metadata = booksMetadata;

export const revalidate = 3600;

export default async function Page() {
  const books = await getBooks();

  return <BooksPage books={books} />;
}
