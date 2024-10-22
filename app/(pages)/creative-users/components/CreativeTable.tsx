"use client";

import { useState, useEffect } from "react";
import { fetchAllUserDetails, updateUserStatus } from "@/services/userDetails/userDetails"; // Adjust the import path
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
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import { toast, ToastContainer } from 'react-toastify';

interface User {
  detailsid: number;
  first_name: string;
  address: string;
  mobileNo: string;
  email: string;
  portfolioLink: string;
  bday: string;
  portfolio: string;
  status: boolean; // This will be added later
}

export default function PaginatedTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchAllUserDetails();
        // Directly use the fetched result without modifying the status
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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

  const handleSwitchChange = async (detailsid: number, currentStatus: boolean) => {
    const newStatus = !currentStatus; // Toggle the status
  
    try {
      // Call the update function to update the status in the backend
      await updateUserStatus(detailsid, newStatus);
      
      // Update the local state to reflect the new status
      setData((prevData) =>
        prevData.map((item) =>
          item.detailsid === detailsid ? { ...item, status: newStatus } : item
        )
      );
      toast.success(`Status updated to ${newStatus ? 'Active' : 'Inactive'}`);
    } catch (error:any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status, Error: ' + error.message);
      // Optionally, you can show a notification or alert the user about the error
    }
  };
  

  return (
    <div className="w-full max-w-[90dvw] mx-auto flex flex-col">
      <div className="w-full py-2 flex justify-between items-center">
        <div className="flex w-full max-w-lg items-center gap-2 relative">
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
          {currentData.map((item, index) => (
            <TableRow key={index} className="hover:bg-gray-300">
              <TableCell>{index + 1}</TableCell>
              <TableCell>{item.first_name}</TableCell>
              <TableCell>{item.address}</TableCell>
              <TableCell>{item.mobileNo}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.bday}</TableCell>
              <TableCell>{item.portfolioLink}</TableCell>
              <TableCell>
                <Switch
                  checked={item.status}
                  onCheckedChange={() => handleSwitchChange(item.detailsid, item.status)}
                  className="data-[state=checked]:bg-green-500"
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
  goToPage,
}) => {
  const pageRange = 3;

  const getPagesToShow = () => {
    let start, end;

    if (currentPage <= 2) {
      start = 1;
      end = Math.min(pageRange, totalPages);
    } else if (currentPage >= totalPages - 1) {
      start = Math.max(totalPages - pageRange + 1, 1);
      end = totalPages;
    } else {
      start = currentPage - 1;
      end = Math.min(start + pageRange - 1, totalPages);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pages = getPagesToShow();

  return (
    <div>
      <Pagination className="w-full max-w-md min-w-[24rem] flex justify-end">
        <PaginationContent className="flex items-center">
          <PaginationItem>
            <PaginationPrevious
              onClick={prevPage}
              className={`bg-slate-900 text-slate-50 w-28 border border-slate-400 ${
                currentPage === 1 ? "disabled" : ""
              }`}
              href="#"
            />
          </PaginationItem>

          {currentPage > 2 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

          {pages.map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                className={`w-10 h-10 flex items-center justify-center ${
                  page === currentPage
                    ? "font-bold text-green-500"
                    : "text-slate-900"
                }`}
                onClick={() => goToPage(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}

          {currentPage < totalPages - 1 && (
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
          )}

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
      <ToastContainer/>
    </div>
  );
};


const TableheaderFields = [
  "ID",
  "Name",
  "Address",
  "Mobile No",
  "Email",
  "Birthday",
  "Portfolio Link",
  "Status",
];
