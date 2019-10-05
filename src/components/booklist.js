import React from "react";
import Book from "../components/book";
import { graphql, useStaticQuery } from "gatsby";
import { getBookImageUrl } from "../utils";

function BookList() {
  const data = useStaticQuery(graphql`
    query {
      goodreadsShelf(name: { eq: "read" }) {
        reviews {
          book {
            title
            image_url
            authors {
              name
            }
          }
          link
          rating
          id
          body
        }
      }
    }
  `);

  return (
    <div class="flex flex-wrap mb-4">
      {data.goodreadsShelf.reviews
        .filter(review => !review.book.image_url.includes("/nophoto/"))
        .map(review => (
          <Book
            imageUrl={getBookImageUrl(review.book.image_url)}
            link={review.link}
          />
        ))}
    </div>
  );
}

export default BookList;
