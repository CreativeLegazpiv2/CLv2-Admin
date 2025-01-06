"use client";
import { useState } from "react";
import { PaginatedTable } from "@/app/(pages)/events/components/EventsTable";
import useAuthRedirect from "@/services/authGurad/authDirect";
import { AddEvents } from "./components/AddEvents";

export interface EventData {
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
  objective:string;
  website:string;
}

export default function Eventspage() {
  useAuthRedirect();

  const [addEvent, setAddEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);

  const openAddEvent = () => {
    setEditingEvent(null);
    setAddEvent(true);
  };

  const openEditEvent = (eventData: EventData) => {
    setEditingEvent(eventData);
    setAddEvent(true);
  };

  const closeAddEvent = () => {
    setAddEvent(false);
    setEditingEvent(null);
  };

  return (
    <main className="flex w-full h-full items-center justify-center">
      <div className="w-full flex flex-col gap-4 h-fit overflow-hidden">
        <div
          className={`transition-all ease-in-out duration-300 ${
            addEvent ? "" : "-mt-[20rem]"
          }`}
        >
          <AddEvents onClose={closeAddEvent} editingEvent={editingEvent} />
        </div>
        <PaginatedTable openAddEvent={openAddEvent} openEditEvent={openEditEvent} />
      </div>
    </main>
  );
}