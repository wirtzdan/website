import React from "react";
import { Link } from "gatsby";

function BlogPostCard({ title, subtitle, timeToRead, slug }) {
  return (
    <Link
      className="my-2 px-2 w-full overflow-hidden md:my-2 md:px-2 md:w-1/2 h-65 overflow-visible"
      to={slug}
    >
      <article className="h-full flex flex-col justify-between items-start bg-white dark:bg-neutral-700 rounded-lg p-6 shadow">
        <div>
          <h2 className="text-3xl leading-tight text font-bold mb-3">
            {title}
          </h2>
          <p className="text-xl text-neutral-500 dark:text-neutral-200 leading-tight">
            {subtitle}
          </p>
        </div>
        <button className="text-sm px-3 py-1 bg-primary-50 text-primary-600 rounded-lg uppercase font-semibold mt-2 dark:bg-primary-500 dark:text-primary-50">
          {timeToRead} minute
        </button>
      </article>
    </Link>
  );
}

export default BlogPostCard;
