"use client";

import { useState, useEffect } from "react";
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
import { Search, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Dummy data for the table
const generateData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: `Item ${i + 1}`,
    address: `Category ${(i % 5) + 1}`,
    mobileNo: `+${(i + 1).toString().padStart(10, "0")}`,
    email: `email${i + 1}@example.com`,
    birthdate: `01/01/2001`,
    portfolio: `Portfolio ${i + 1}`,
    action: false,
  }));
};

export default function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<
    {
      id: number;
      name: string;
      address: string;
      mobileNo: string;
      email: string;
      birthdate: string;
      portfolio: string;
      action: boolean;
    }[]
  >([]);

  useEffect(() => {
    setData(generateData()); // Generates data after the component has mounted
  }, []);

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

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSwitchChange = (id: number) => {
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.id === id ? { ...item, action: !item.action } : item
      );

      // Instead of finding the item again, log it directly
      const updatedItem = updatedData.find((item) => item.id === id);
      if (updatedItem) {
        console.log(
          `Item ID: ${updatedItem.id}, Action: ${updatedItem.action}`
        );
      }

      return updatedData; // Return the updated state
    });
  };

  return (
    <div className="w-full max-w-[90dvw] mx-auto flex flex-col">
      <div className="w-full py-2 flex justify-between items-center">
        <div className="flex w-full max-w-lg items-center gap-2 relative ">
          <Search className="absolute left-4" />
          <Input
            className="pl-12 border border-slate-900"
            type="text"
            placeholder="Search ..."
          />
          <Button type="submit">
            <Send className="text-4xl text-green-500" size={16} />
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-slate-900 ">
          <TableRow className="hover:bg-slate-900 ">
            {TableheaderFields.map((field) => (
              <TableHead key={field} className="text-white uppercase">
                {field}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-300">
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.mobileNo}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.birthdate}</TableCell>
              <TableCell>{item.portfolio}</TableCell>
              <TableCell>
                <Switch 
                checked={item.action} 
                onCheckedChange={() => handleSwitchChange(item.id)}
                className="data-[state=checked]:bg-green-500 "
                 />
              </TableCell>
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
            goToPage={goToPage}
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
  goToPage, // Add this new prop to handle jumping to a specific page
}) => {
  const pageRange = 3; // Number of pages to display at once

  // Calculate pages to show based on currentPage
  const getPagesToShow = () => {
    let start, end;

    if (currentPage <= 2) {
      start = 1;
      end = Math.min(pageRange, totalPages); // Show first 3 pages
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(totalPages - pageRange + 1, 1); // Show last 3 pages
      end = totalPages;
    } else {
      start = currentPage - 1; // Show current page in the middle
      end = Math.min(start + pageRange - 1, totalPages);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPagesToShow();

  return (
    <div>
      <Pagination className="w-full max-w-md min-w-[24rem] flex justify-between">
        <PaginationContent className="flex items-center">
          {/* Previous Button */}
          <PaginationItem>
            <PaginationPrevious
              onClick={prevPage}
              className={`bg-slate-900 text-slate-50 w-28 border border-slate-400 ${
                currentPage === 1 ? "disabled" : ""
              }`}
              href="#"
            />
          </PaginationItem>

          {/* Ellipsis before the page numbers if we're past the first 3 pages */}
          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Display 3 pages dynamically */}
          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={`w-10 h-10 flex items-center justify-center ${
                  page === currentPage
                    ? "font-bold text-green-500"
                    : "text-slate-900"
                }`}
                onClick={() => goToPage(page)} // Jump to the clicked page
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* Ellipsis after the page numbers if there are more pages to come */}
          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {/* Next Button */}
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
    </div>
  );
};

const TableheaderFields = [
  "ID",
  "Name",
  "Address",
  "mobile no",
  "email",
  "Birtdate",
  "Portfolio",
  "Action",
];
