"use client";

import { useEffect, useMemo, useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Pagination, Loader } from "@insurance/ui";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface CommonTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  pageSize?: number;
  emptyMessage?: string;
  keyExtractor: (item: T) => string;
}

export function CommonTable<T>({
  columns,
  data,
  isLoading,
  pageSize = 10,
  emptyMessage = "No data found",
  keyExtractor
}: CommonTableProps<T>) {
  const [page, setPage] = useState(1);

  const totalPages = useMemo(() => Math.ceil(data.length / pageSize) || 1, [data, pageSize]);

  const paginated = useMemo(() => {
    return data.slice((page - 1) * pageSize, page * pageSize);
  }, [data, page, pageSize]);

  // Reset to page 1 when data changes
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [data, totalPages, page]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader />
      </div>
    );
  }

  if (paginated.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((item) => (
            <TableRow key={keyExtractor(item)}>
              {columns.map((col) => (
                <TableCell key={col.key}>{col.render(item)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </>
  );
}