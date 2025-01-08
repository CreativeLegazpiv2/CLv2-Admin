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
import { EventData } from "../page";
import Modal from "@/components/modals/event-registered-users";
import { RegisteredEventPage } from "../registered/[slug]/RegisteredEvent";

// Dummy data for the table
interface AdminEvent {
  id: number;
  title: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  desc: string;
  image_path: File;
  created_at: string;
  status: boolean;
  links: string;
  contact: string;
  announcement: string;
  objective: string;
  website: string;
}

interface EventsTableProps {
  openAddEvent: () => void;
  openEditEvent: (item: EventData) => void;
}

export const PaginatedTable: React.FC<EventsTableProps> = ({
  openAddEvent,
  openEditEvent,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState<AdminEvent[]>([]);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{
    id: number;
    title: string;
    desc: string;
    location: string;
  } | null>(null);

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
  const currentData = Array.isArray(data)
    ? data.slice(startIndex, endIndex)
    : [];

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
    const currentItem = data.find((item) => item.id === id);
    if (!currentItem) return;

    const updatedStatus = !currentItem.status;

    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, status: updatedStatus } : item
      )
    );

    try {
      const response = await fetch(`/api/events`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: updatedStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const result = await response.json();
      console.log("Update successful:", result);
    } catch (error) {
      console.error("Error updating status:", error);

      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, status: !updatedStatus } : item
        )
      );
    }
  };

  const viewRegisteredUser = (event: AdminEvent) => {
    // Only pass the required fields to the modal
    setSelectedEvent({
      id: event.id,
      title: event.title,
      desc: event.desc,
      location: event.location,
    });
    setIsModalOpen(true); // Open the modal
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
          if (payload.eventType === "UPDATE") {
            setData((prevData) =>
              prevData.map((item) =>
                item.id === payload.new.id ? { ...item, ...payload.new } : item
              )
            );
            return toast({
              title: "Event Updated",
              description: "The event has been updated.",
              duration: 5000,
              variant: "success",
            });
          } else if (payload.eventType === "INSERT") {
            setData((prevData) => [...prevData, payload.new as AdminEvent]);
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
    setDeleteItemId(id);
    setShowDeleteModal(true);
  };

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

  const handleEdit = (item: EventData) => {
    openEditEvent(item);
  };

  return (
    <div className="w-full max-w-[90dvw] mx-auto flex flex-col">
      <div className="w-full py-2 flex justify-between items-center">
        <div className="w-full flex items-center justify-between px-0.5">
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
                  className={`${item.title.length > 10 ? "line-clamp-1" : ""}`}
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
                <p className={`${item.desc.length > 10 ? "line-clamp-1" : ""}`}>
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
                  <Button
                    className="bg-slate-900 text-stone-50 group w-16 hover:text-green-500 mr-2"
                    onClick={() => viewRegisteredUser(item)}
                  >
                    Users
                  </Button>
                  <Button
                    onClick={() => handleEdit(item)}
                    className="bg-slate-900 text-stone-50 group w-16 hover:text-green-500 mr-2"
                  >
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2>Registered Users</h2>
        {selectedEvent && (
          <RegisteredEventPage
          event={{
            id: selectedEvent.id,
            title: selectedEvent.title,
            desc: selectedEvent.desc,
            location: selectedEvent.location
          }}
          />
        )}
      </Modal>
    </div>
  );
};

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

const TableheaderFields = [
  "ID",
  "Event Name",
  "Location",
  "Event Date",
  "Start Time",
  "End Time",
  "Description",
  "Created At",
  "Status",
  "Action",
];