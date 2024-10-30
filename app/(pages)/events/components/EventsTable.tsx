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
import { DeleteModal } from "./DeleteModal";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "@/services/supabaseClient";
import { useToast } from "@/hooks/use-toast";

// Dummy data for the table
interface AdminEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  desc: string;
  image: File;
  created_at: string;
  status: boolean;
}


interface EventsTableProps {
  openAddEvent: () => void;
}
export const PaginatedTable: React.FC<EventsTableProps> = ({
  openAddEvent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<AdminEvent[]>([]);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/events", {
          method: "GET",
        });
        if (!response.ok) throw new Error("Error fetching events");

        const events = await response.json();
        setData(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchData();
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleSwitchChange = async (id: number) => {
    // Find the current status of the event
    const currentItem = data.find(item => item.id === id);
    if (!currentItem) return;

    // Toggle the status locally
    const updatedStatus = !currentItem.status;

    // Update the data state optimistically
    setData(prevData =>
      prevData.map(item =>
        item.id === id ? { ...item, status: updatedStatus } : item
      )
    );

    try {
      // Send the PUT request to update the status
      const response = await fetch(`/api/events`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: updatedStatus }),
      });

      // Check for errors in the response
      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      console.log("Update successful:", result);
    } catch (error) {
      console.error("Error updating status:", error);

      // Roll back the state if the update fails
      setData(prevData =>
        prevData.map(item =>
          item.id === id ? { ...item, status: !updatedStatus } : item
        )
      );
    }
  };

  const { toast } = useToast();

  useEffect(() => {
    const subscription = supabase
      .channel("admin_events_Channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_events",
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setData(prevData =>
              prevData.map(item =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
            return toast({
              title: 'Event Updated',
              description: 'The event has been updated.',
              duration: 5000,
              variant: 'success',
            })
          } else if (payload.eventType === 'INSERT') {
            // Ensure payload.new is in the shape of AdminEvent
            setData(prevData => [...prevData, payload.new as AdminEvent]);
          }

        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);



  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = (id: number) => {
    setDeleteItemId(id); // Set the ID of the item to be deleted
    setShowDeleteModal(true); // Show the modal
  };


  const formatDateToPH = (dateString: string) => {
    const date = new Date(dateString);

    // Convert to Philippine time (UTC+8)
    const options: Intl.DateTimeFormatOptions = {
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Manila'
    };

    // Format the date
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  const handleDeleteSuccess = () => {
    setData((prevData) => prevData.filter((item) => item.id !== deleteItemId));
    setDeleteItemId(null);
    setShowDeleteModal(false);
    toast({
      title: "Event Deleted",
      description: "The event was successfully deleted.",
      duration: 5000,
      variant: "success",
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
                key={field + 1}
                className={`text-white uppercase ${field === "ID" ? "w-[5%]" : "w-[10%]"
                  } `}
              >
                {field}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentData.map((item, index) => (
            <TableRow key={`${item.id}-${index}`} className="hover:bg-gray-300">
              <TableCell>{item.id}</TableCell>
              <TableCell>
                <p
                  className={`${item.title.length > 10 ? "line-clamp-1" : ""
                    }`}
                >
                  {item.title}
                </p>
              </TableCell>
              <TableCell>
                <p
                  className={`${item.location.length > 10 ? "line-clamp-1" : ""
                    }`}
                >
                  {item.location}
                </p>
              </TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.start_time}</TableCell>
              <TableCell>{item.end_time}</TableCell>
              <TableCell>
                <p
                  className={`${item.desc.length > 10 ? "line-clamp-1" : ""
                    }`}
                >
                  {item.desc}
                </p>
              </TableCell>
              <TableCell>{formatDateToPH(item.created_at)}</TableCell>
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
                  <Button
                    onClick={() => handleDelete(item.id)}
                    className="bg-slate-900 text-stone-50 group w-16 hover:text-red-500"
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
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowDeleteModal(false)}
            className="w-full h-dvh fixed top-0 left-0 z-[1000] bg-black/50"
          >
            <DeleteModal
              onClose={() => setShowDeleteModal(false)}
              deleteItemId={deleteItemId}
              onDeleteSuccess={handleDeleteSuccess} 
            />
          </motion.div>
        )}
      </AnimatePresence>
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
              className={`bg-slate-900 text-slate-50 w-28 border border-slate-400 ${currentPage === 1 ? "disabled" : ""
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
                className={`w-10 h-10 flex items-center justify-center ${page === currentPage
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
