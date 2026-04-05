import { useState } from "react";

function usePagination<T>(data: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1);

  const maxPage = Math.ceil(data.length / itemsPerPage);

  function currentData() {
    const end = currentPage * itemsPerPage;
    return data.slice(0, end);
  }

  function next() {
    setCurrentPage((page) => Math.min(page + 1, maxPage));
  }

  return { next, currentData, currentPage, maxPage };
}

export default usePagination;
