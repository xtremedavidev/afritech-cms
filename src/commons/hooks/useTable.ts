import { useState, useMemo } from 'react';

export type UseTableOptions<T> = {
  data: T[];
  initialPage?: number;
  pageSize?: number;
  initialSortBy?: keyof T | string;
  initialSortDirection?: 'asc' | 'desc';
};

export function useTable<T>({
  data,
  initialPage = 1,
  pageSize = 10,
  initialSortBy,
  initialSortDirection = 'asc',
}: UseTableOptions<T>) {
  const [page, setPage] = useState(initialPage);
  const [sortBy, setSortBy] = useState<string | undefined>(initialSortBy as string | undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(initialSortDirection);

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortBy as keyof T];
      const bValue = b[sortBy as keyof T];
      if (aValue === bValue) return 0;
      if (sortDirection === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [data, sortBy, sortDirection]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);

  // Handler for sort change
  const handleSortChange = (col: string, dir: 'asc' | 'desc') => {
    setSortBy(col);
    setSortDirection(dir);
    setPage(1); // Reset to first page on sort
  };

  // Handler for page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    page,
    setPage: handlePageChange,
    pageSize,
    sortBy,
    sortDirection,
    setSortBy,
    setSortDirection,
    onSortChange: handleSortChange,
    data: paginatedData,
    total,
    totalPages,
    rawData: data,
  };
}