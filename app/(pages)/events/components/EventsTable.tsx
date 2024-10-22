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
import { CalendarArrowUp, Search, Send } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Dummy data for the table
const generateData = () => {
  return Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    event_name: `Item ${i + 1}`,
    event_location: `Location ${(i % 5) + 1}`,
    event_date: new Date().toLocaleDateString(),
    str_time: "10:00 AM",
    end_time: "11:00 AM",
    description: `Description ${i + 1}`,
    createdAt: new Date().toLocaleDateString(),
    status: false,
    action: false,
  }));
};

interface EventsTableProps {
  openAddEvent: () => void; 
}
export const PaginatedTable: React.FC<EventsTableProps> = ({
  openAddEvent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<
    {
      id: number;
      event_name: string;
      event_location: string;
      event_date: string;
      str_time: string;
      end_time: string;
      description: string;
      createdAt: string;
      status: boolean;
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
        item.id === id ? { ...item, status: !item.status } : item
      );

      // Instead of finding the item again, log it directly
      const updatedItem = updatedData.find((item) => item.id === id);
      if (updatedItem) {
        console.log(
          `Item ID: ${updatedItem.id}, Action: ${updatedItem.status}`
        );
      }

      return updatedData; // Return the updated state
    });
  };
  

  return (
    <div className="w-full max-w-[90dvw] mx-auto flex flex-col">
      <div className="w-full py-2 flex justify-between items-center">
        <div className="w-full flex items-center justify-between">
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
          <Button
            className={`bg-slate-900 text-stone-50 group hover:bg-green-500 hover:text-slate-900 w-32 py-3 `}
            variant="outline"
            onClick={openAddEvent}
          >
            <CalendarArrowUp
              className="text-green-500 group-hover:text-slate-900"
              size={32}
            />
            Add Event
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader className="bg-slate-900 ">
          <TableRow className="hover:bg-slate-900 ">
            {TableheaderFields.map((field) => (
              <TableHead
                key={field}
                className={`text-white uppercase ${
                  field === "ID" ? "w-[5%]" : "w-[10%]"
                } `}
              >
                {field}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id} className="hover:bg-gray-300">
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <p
                  className={`${
                    item.event_name.length > 10 ? "line-clamp-1" : ""
                  }`}
                >
                  {item.event_name}
                </p>
              </TableCell>
              <TableCell>
                <p
                  className={`${
                    item.event_location.length > 10 ? "line-clamp-1" : ""
                  }`}
                >
                  {item.event_location}
                </p>
              </TableCell>
              <TableCell>{item.event_date}</TableCell>
              <TableCell>{item.str_time}</TableCell>
              <TableCell>{item.end_time}</TableCell>
              <TableCell>
                <p
                  className={`${
                    item.description.length > 10 ? "line-clamp-1" : ""
                  }`}
                >
                  {item.description}
                </p>
              </TableCell>
              <TableCell>{item.createdAt}</TableCell>
              <TableCell>
                <Switch
                  checked={item.status}
                  onCheckedChange={() => handleSwitchChange(item.id)}
                  className="data-[state=checked]:bg-green-500 "
                />
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-2">
                  <Button className="bg-slate-900 text-stone-50 group w-16 hover:text-green-500 mr-2">
                    Edit
                  </Button>
                  <Button className="bg-slate-900 text-stone-50 group w-16 hover:text-red-500">
                    Delete
                  </Button>
                </div>
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
};

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
      <Pagination className="w-full max-w-md min-w-[24rem] flex justify-end">
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
  "Event Name",
  "Location",
  "Date",
  "start time",
  "end time",
  "Description",
  "Created At",
  "Status",
  "Action",
];
