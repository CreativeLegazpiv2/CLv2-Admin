"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

// Dummy data
const data = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
  category: `Category ${(i % 5) + 1}`,
  price: `$${(Math.random() * 100).toFixed(2)}`,
}));

export default function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="w-full max-w-[90dvw] mx-auto p-4">
      <div className="w-full p-2 flex justify-between items-center">
        <div className="flex w-full max-w-lg items-center space-x-2 relative">
          <Input type="email" placeholder="Email" />
          <Button type="submit">Search</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-300">
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.category}</TableCell>
              <TableCell>{item.price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4 p-2 bg-gray-200">
        <div>
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
          {data.length} entries
        </div>
        <div className="space-x-2">
          <PaginationUi
            currentPage={currentPage}
            totalPages={totalPages}
            prevPage={prevPage}
            nextPage={nextPage}
          />
        </div>
      </div>
    </div>
  );
}

const PaginationUi: React.FC<any> = ({
  currentPage,
  totalPages,
  prevPage,
  nextPage,
}) => {
  return (
    <Pagination className="w-fit">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={prevPage}
            className={currentPage === 1 ? "disabled" : ""}
            href="#"
          />
        </PaginationItem>
        <PaginationItem>
          {/* Number of pages to be shown */}
          <PaginationLink href="#">{currentPage}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={nextPage}
            className={`bg-slate-900 text-slate-50 w-28 border border-slate-400 ${
              currentPage === totalPages ? "disabled" : ""
            }`}
            href="#"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
