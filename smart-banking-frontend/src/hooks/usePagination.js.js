import { useState } from 'react';

export const usePagination = (initialPage = 0, initialSize = 20) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const updatePagination = (pageInfo) => {
    setTotalPages(pageInfo.totalPages);
    setTotalElements(pageInfo.totalElements);
  };

  const nextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const changePageSize = (newSize) => {
    setSize(newSize);
    setPage(0); // Reset to first page when changing page size
  };

  return {
    page,
    size,
    totalPages,
    totalElements,
    updatePagination,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    hasNextPage: page < totalPages - 1,
    hasPrevPage: page > 0
  };
};