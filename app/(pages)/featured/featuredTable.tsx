"use client";

import { useEffect, useState } from "react";
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
import AddEventPanel, { AdminEvent } from "./addFeatures";

interface EventsTableProps { }

export const PaginatedTable: React.FC<EventsTableProps> = () => {
  const [data, setData] = useState<AdminEvent[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  // New state for delete confirmation
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/featured/fetch");
        if (res.ok) {
          const result = await res.json();
          const events: AdminEvent[] = result.data;
          setData(events);
        } else {
          console.error("Failed to fetch featured");
        }
      } catch (err) {
        console.error("Error fetching featured:", err);
      }
    };
    fetchData();
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToPage = (pageNumber: number) => setCurrentPage(pageNumber);

  const formatDateToPH = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Manila",
    };
    return date.toLocaleString("en-US", options).replace(",", "");
  };

  // Callback from AddEventPanel to add the new event to the table
  const handleNewEvent = (newEvent: AdminEvent) => {
    setData((prevData) => [newEvent, ...prevData]);
    setIsPanelOpen(false);
  };

  // This function calls the DELETE API without using the native confirm
  const deleteConfirmed = async (id: string) => {
    try {
      console.log(`Sending delete request for id: ${id}`)

      const res = await fetch(`/api/featured/delete/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setData((prevData) => prevData.filter((item) => String(item.id) !== id));
        console.log("✅ Record and associated image deleted successfully");
      } else {
        const errorResponse = await res.json();
        console.error("❌ Delete failed:", errorResponse.error);
      }
    } catch (error) {
      console.error("❌ Error deleting record:", error);
    }
  };


  // When the Delete button is clicked, set the pending delete and show modal
  const handleDeleteButtonClick = (id: string) => {
    setPendingDeleteId(id);
    setIsConfirmModalOpen(true);
  };

  // Called when the user confirms deletion in the modal
  const handleConfirmDelete = async () => {
    if (pendingDeleteId) {
      await deleteConfirmed(pendingDeleteId);
    }
    setPendingDeleteId(null);
    setIsConfirmModalOpen(false);
  };

  // Called when the user cancels deletion in the modal
  const handleCancelDelete = () => {
    setPendingDeleteId(null);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="w-full max-w-[90dvw] mx-auto flex flex-col">
      {/* Add Event Panel */}
      <AddEventPanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        onEventAdded={handleNewEvent}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Are you sure you want to delete this record?"
      />

      <div className="w-full py-2 flex justify-between items-center">
        <div className="w-full flex items-center justify-between px-0.5">
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
          <div className="flex gap-2">
            <Button
              className="bg-slate-900 text-stone-50 group hover:bg-green-500 hover:text-slate-900 w-32 py-3"
              variant="outline"
              onClick={() => setIsPanelOpen(true)}
            >
              Add Featured
            </Button>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-slate-900">
          <TableRow>
            {TableheaderFields.map((field) => (
              <TableHead
                key={field}
                className={`text-white uppercase ${field === "ID" ? "w-[5%]" : "w-[10%]"
                  }`}
              >
                {field}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item) => (
            <TableRow key={item.id ?? item.title ?? Math.random()} className="hover:bg-gray-300">
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <p className={`${item.title?.length && item.title.length > 10 ? "line-clamp-1" : ""}`}>
                  {item.title ?? "Untitled"}
                </p>
              </TableCell>
              <TableCell>
                <img
                  src={item.image_url}
                  className="w-20 h-20 object-cover"
                />
              </TableCell>
              <TableCell>{formatDateToPH(item.created_at)}</TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-2">
                  <Button
                    className="bg-slate-900 text-stone-50 group w-16 hover:text-red-500"
                    onClick={() => handleDeleteButtonClick(String(item.id))}
                  >
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

const PaginationUi: React.FC<{
  currentPage: number;
  totalPages: number;
  prevPage: () => void;
  nextPage: () => void;
  goToPage: (pageNumber: number) => void;
}> = ({ currentPage, totalPages, prevPage, nextPage, goToPage }) => {
  const pageRange = 3;

  const getPagesToShow = () => {
    let start: number, end: number;
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
              className={`bg-slate-900 text-slate-50 w-28 border border-slate-400 ${currentPage === 1 ? "disabled" : ""
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
                className={`w-10 h-10 flex items-center justify-center ${page === currentPage
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
              className={`bg-slate-900 text-slate-50 w-28 border border-slate-400 ${currentPage === totalPages ? "disabled" : ""
                }`}
              href="#"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

const ConfirmModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}> = ({ isOpen, onConfirm, onCancel, message = "Are you sure?" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button onClick={onConfirm} className="bg-red-500 text-white">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

const TableheaderFields = [
  "ID",
  "Event Name",
  "Image",
  "Created At",
  "Action",
];

export default PaginatedTable;
